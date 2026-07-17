"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type GalleryPhoto = {
  src: string;
  name: string;
};

export default function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [preview, setPreview] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    if (!preview) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreview(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [preview]);

  return (
    <>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <li
            key={photo.src}
            className="appear"
            style={{
              animationDelay: `${240 + Math.min(index, 20) * 30}ms`,
            }}
          >
            <button
              type="button"
              onClick={() => setPreview(photo)}
              className="poster-hover relative block aspect-[9/16] w-full overflow-hidden rounded-[2px] border border-[color:var(--line)] bg-[color:var(--card-bg)]"
              aria-label={`Preview ${photo.name}`}
            >
              <Image
                src={photo.src}
                alt={photo.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {preview ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={preview.name}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--background)]/88 p-4 backdrop-blur-[2px]"
          onClick={() => setPreview(null)}
        >
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute right-5 top-5 text-[13px] tracking-[0.05em] text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
            aria-label="Close preview"
          >
            CLOSE
          </button>
          {/* native img so the preview renders at full source resolution */}
          <img
            src={preview.src}
            alt={preview.name}
            className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
