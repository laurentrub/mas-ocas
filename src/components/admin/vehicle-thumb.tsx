"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
};

/** Miniature admin : `<img>` natif + fallback si URL morte (ex. fbcdn expiré). */
export function AdminVehicleThumb({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "relative size-14 shrink-0 overflow-hidden rounded-lg bg-[#eef2f7]",
        className
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- aperçu admin, URLs externes variables
        <img
          src={src!}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#9aa8ba]">
          <ImageIcon className="size-5" aria-hidden />
        </div>
      )}
    </div>
  );
}
