"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  src: string;
  alt: string;
};

type Props = {
  images: GalleryImage[];
  brand: string;
  model: string;
};

export function VehicleGallery({ images, brand, model }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  const hasThumbs = images.length > 1;

  if (!current) return null;

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        <span className="sr-only">
          Photo {active + 1} sur {images.length} — {brand} {model}
        </span>
      </div>
      {hasThumbs ? (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <li key={`${img.src}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
                  index === active ? "border-orange" : "border-transparent"
                )}
                aria-label={`Voir la photo ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                  loading="lazy"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
