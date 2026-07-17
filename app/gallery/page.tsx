import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
import AsciiCat from "@/components/ascii-cat";
import GalleryGrid from "@/components/gallery-grid";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
]);

async function getGalleryPhotos() {
  const galleryDir = path.join(process.cwd(), "public", "gallery");

  try {
    const entries = await fs.readdir(galleryDir, { withFileTypes: true });

    return entries
      .filter((entry) => {
        if (!entry.isFile()) {
          return false;
        }

        return IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase());
      })
      .map((entry) => {
        const encodedName = entry.name
          .split("/")
          .map((segment) => encodeURIComponent(segment))
          .join("/");

        return {
          src: `/gallery/${encodedName}`,
          name: path.parse(entry.name).name,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const photos = await getGalleryPhotos();

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
            <span className="text-[color:var(--foreground)]">Gallery</span>
          </nav>

          <h1
            className="appear text-[36px] leading-tight text-[color:var(--foreground)]"
            style={{ animationDelay: "130ms" }}
          >
            Gallery
          </h1>
          <p
            className="appear mt-2 text-[15px] text-[color:var(--muted)]"
            style={{ animationDelay: "180ms" }}
          >
            {photos.length} {photos.length === 1 ? "photo" : "photos"}
          </p>

          {photos.length > 0 ? (
            <GalleryGrid photos={photos} />
          ) : (
            <p
              className="appear mt-8 text-[15px] text-[color:var(--muted)]"
              style={{ animationDelay: "240ms" }}
            >
              No photos yet.
            </p>
          )}
        </div>

        <aside
          className="appear mt-8 md:mt-3"
          style={{ animationDelay: "220ms" }}
        >
          <AsciiCat />
        </aside>
      </section>
    </main>
  );
}
