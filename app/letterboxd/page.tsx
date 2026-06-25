import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
import AsciiCat from "@/components/ascii-cat";

type RatedMovie = {
  name: string;
  year: string;
  uri: string;
  rating: string;
};

type RatedMovieWithPoster = RatedMovie & {
  posterUrl: string | null;
};

const POSTER_OVERRIDES: Record<string, string> = {
  "inception|2010":
    "https://a.ltrbxd.com/resized/sm/upload/sv/95/s9/4j/inception-0-600-0-900-crop.jpg?v=30d7224316",
  "interstellar|2014":
    "https://a.ltrbxd.com/resized/film-poster/1/1/7/6/2/1/117621-interstellar-0-600-0-900-crop.jpg?v=7ad89e6666",
  "obsession|2025":
    "https://a.ltrbxd.com/resized/film-poster/1/2/3/4/4/7/2/1234472-obsession-2025-2-0-600-0-900-crop.jpg?v=cff6fc00b6",
  "project hail mary|2026":
    "https://a.ltrbxd.com/resized/film-poster/6/1/1/2/8/8/611288-project-hail-mary-0-600-0-900-crop.jpg?v=ac31b6ec03",
};

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function ratingToStars(rating: string): string {
  const value = Number(rating);
  if (!Number.isFinite(value) || value <= 0) {
    return "—";
  }

  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;
  return `${"★".repeat(fullStars)}${hasHalfStar ? "½" : ""}`;
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type TmdbSearchResponse = {
  results?: Array<{
    title?: string;
    release_date?: string;
    poster_path?: string | null;
    popularity?: number;
  }>;
};

function getBestTmdbMatch(
  results: NonNullable<TmdbSearchResponse["results"]>,
  movieName: string,
  movieYear: string,
) {
  const normalizedName = normalizeTitle(movieName);
  const year = Number(movieYear);
  let best:
    | {
        posterPath: string;
        score: number;
      }
    | null = null;

  for (const result of results) {
    if (!result.poster_path || !result.title) {
      continue;
    }

    const resultTitle = normalizeTitle(result.title);
    const resultYear = Number(result.release_date?.slice(0, 4) ?? "");
    let score = 0;

    if (resultTitle === normalizedName) {
      score += 100;
    } else if (
      resultTitle.includes(normalizedName) ||
      normalizedName.includes(resultTitle)
    ) {
      score += 55;
    }

    if (Number.isFinite(year) && Number.isFinite(resultYear)) {
      const diff = Math.abs(year - resultYear);
      score += diff === 0 ? 28 : Math.max(0, 12 - diff * 4);
    }

    score += Math.min((result.popularity ?? 0) / 20, 8);

    if (!best || score > best.score) {
      best = {
        posterPath: result.poster_path,
        score,
      };
    }
  }

  return best?.score && best.score >= 45 ? best.posterPath : null;
}

async function getPosterUrl(name: string, year: string): Promise<string | null> {
  if (!name) {
    return null;
  }

  const overrideKey = `${normalizeTitle(name)}|${year}`;
  if (POSTER_OVERRIDES[overrideKey]) {
    return POSTER_OVERRIDES[overrideKey];
  }

  try {
    const searchParams = new URLSearchParams({
      query: name,
      language: "en-US",
    });

    if (year) {
      searchParams.set("year", year);
    }

    const response = await fetch(
      `https://tmdb.lewagon.com/search/movie?${searchParams.toString()}`,
      {
        next: { revalidate: 60 * 60 * 24 * 7 },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as TmdbSearchResponse;
    if (!data.results?.length) {
      return null;
    }

    const posterPath = getBestTmdbMatch(data.results, name, year);
    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;
  } catch {
    return null;
  }
}

async function getRatedMovies(): Promise<RatedMovie[]> {
  const csvPath = path.join(process.cwd(), "public", "ratings.csv");
  const rawCsv = await fs.readFile(csvPath, "utf8");
  const lines = rawCsv.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  const nameIndex = headers.indexOf("Name");
  const yearIndex = headers.indexOf("Year");
  const uriIndex = headers.indexOf("Letterboxd URI");
  const ratingIndex = headers.indexOf("Rating");

  if ([nameIndex, yearIndex, uriIndex, ratingIndex].some((index) => index < 0)) {
    return [];
  }

  return lines
    .slice(1)
    .map((line) => parseCsvLine(line))
    .filter((row) => row[ratingIndex] && row[ratingIndex].trim().length > 0)
    .map((row) => ({
      name: row[nameIndex] ?? "",
      year: row[yearIndex] ?? "",
      uri: row[uriIndex] ?? "",
      rating: row[ratingIndex] ?? "",
    }))
    .sort((a, b) => {
      const ratingA = Number(a.rating);
      const ratingB = Number(b.rating);
      if (ratingA !== ratingB) {
        return ratingB - ratingA;
      }

      const yearA = Number(a.year);
      const yearB = Number(b.year);
      if (Number.isFinite(yearA) && Number.isFinite(yearB) && yearA !== yearB) {
        return yearB - yearA;
      }

      return a.name.localeCompare(b.name);
    });
}

async function getRatedMoviesWithPosters(): Promise<RatedMovieWithPoster[]> {
  const movies = await getRatedMovies();
  const posterUrls = await Promise.all(
    movies.map((movie) => getPosterUrl(movie.name, movie.year)),
  );

  return movies.map((movie, index) => ({
    ...movie,
    posterUrl: posterUrls[index],
  }));
}

function getLetterboxdHref(uri: string): string {
  if (!uri) {
    return "https://letterboxd.com/";
  }

  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return uri;
  }

  if (uri.startsWith("/")) {
    return `https://letterboxd.com${uri}`;
  }

  return `https://${uri}`;
}

export default async function LetterboxdPage() {
  const movies = await getRatedMoviesWithPosters();

  return (
    <main className="min-h-screen bg-background px-8 py-12 md:px-28">
      <section className="mx-auto max-w-[1240px] md:grid md:grid-cols-[minmax(0,980px)_200px] md:items-start md:gap-6">
        <div>
          <nav
            className="appear mb-7 text-[13px] text-[color:var(--muted-soft)]"
            style={{ animationDelay: "70ms" }}
          >
            <Link
              href="/"
              className="transition-colors hover:text-[color:var(--foreground)]"
            >
              Home
            </Link>
            <span className="px-2">/</span>
            <span className="text-[color:var(--foreground)]">Letterboxd</span>
          </nav>

          <h1
            className="appear text-[36px] leading-tight text-[color:var(--foreground)]"
            style={{ animationDelay: "130ms" }}
          >
            Letterboxd Ratings
          </h1>
          <p
            className="appear mt-2 text-[15px] text-[color:var(--muted)]"
            style={{ animationDelay: "180ms" }}
          >
            {movies.length} movies rated
          </p>

          <ul className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(78px,1fr))] gap-2">
            {movies.map((movie, index) => (
              <li
                key={`${movie.name}-${movie.year}-${movie.uri}`}
                className="appear"
                style={{ animationDelay: `${240 + Math.min(index, 20) * 30}ms` }}
              >
                <a
                  href={getLetterboxdHref(movie.uri)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div
                    className="poster-hover relative aspect-[2/3] overflow-hidden rounded-[2px] border border-[color:var(--line)] bg-[color:var(--card-bg)] bg-cover bg-center"
                    style={
                      movie.posterUrl
                        ? { backgroundImage: `url("${movie.posterUrl}")` }
                        : undefined
                    }
                  >
                    {!movie.posterUrl ? (
                      <div className="flex h-full items-center justify-center px-2 text-center text-[12px] text-[color:var(--muted)]">
                        {ratingToStars(movie.rating)}
                      </div>
                    ) : null}

                    <div className="pointer-events-none absolute bottom-1 left-1 right-1 truncate rounded-[2px] bg-[color:var(--foreground)] px-1.5 py-1 text-center text-[10px] leading-none text-[color:var(--background)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                      {movie.name}
                    </div>
                  </div>

                  <div className="mt-1">
                    <p className="text-[11px] leading-none tracking-[0.03em] text-[color:var(--muted)]">
                      {ratingToStars(movie.rating)}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {movies.every((movie) => !movie.posterUrl) ? (
            <p className="mt-6 text-[13px] text-[color:var(--muted-soft)]">
              Couldn&apos;t fetch poster thumbnails right now, so fallback cards are
              shown.
            </p>
          ) : null}
        </div>

        <aside className="appear mt-8 md:mt-3" style={{ animationDelay: "220ms" }}>
          <AsciiCat />
        </aside>
      </section>
    </main>
  );
}
