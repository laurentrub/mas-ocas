"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Star, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type UrlPhoto = { kind: "url"; src: string; alt: string };
type FilePhoto = { kind: "file"; id: string; file: File; preview: string };
type Photo = UrlPhoto | FilePhoto;

type Props = {
  defaultImage?: string | null;
  defaultAlt?: string | null;
  defaultGallery?: { src: string; alt: string }[] | null;
};

function syncFileInput(input: HTMLInputElement | null, files: File[]) {
  if (!input) return;
  const transfer = new DataTransfer();
  for (const file of files) transfer.items.add(file);
  input.files = transfer.files;
}

function makeFilePhoto(file: File): FilePhoto {
  return {
    kind: "file",
    id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
    file,
    preview: URL.createObjectURL(file),
  };
}

function photoPreview(photo: Photo): string {
  return photo.kind === "url" ? photo.src : photo.preview;
}

function photoKey(photo: Photo): string {
  return photo.kind === "url" ? photo.src : photo.id;
}

function revokeIfFile(photo: Photo | null | undefined) {
  if (photo?.kind === "file") URL.revokeObjectURL(photo.preview);
}

export function VehiclePhotosField({
  defaultImage,
  defaultAlt,
  defaultGallery,
}: Props) {
  const mainFileId = useId();
  const galleryFileId = useId();
  const mainFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  const [main, setMain] = useState<Photo | null>(() =>
    defaultImage
      ? { kind: "url", src: defaultImage, alt: defaultAlt ?? "" }
      : null
  );
  const [gallery, setGallery] = useState<Photo[]>(() =>
    (defaultGallery ?? []).map((g) => ({
      kind: "url" as const,
      src: g.src,
      alt: g.alt,
    }))
  );
  const [showUrl, setShowUrl] = useState(false);

  useEffect(() => {
    return () => {
      revokeIfFile(main);
      for (const p of gallery) revokeIfFile(p);
    };
    // revoke on unmount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function syncInputs(nextMain: Photo | null, nextGallery: Photo[]) {
    queueMicrotask(() => {
      syncFileInput(
        mainFileRef.current,
        nextMain?.kind === "file" ? [nextMain.file] : []
      );
      syncFileInput(
        galleryFileRef.current,
        nextGallery
          .filter((p): p is FilePhoto => p.kind === "file")
          .map((p) => p.file)
      );
    });
  }

  function onMainFileChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    const next = makeFilePhoto(file);
    setMain((prev) => {
      if (prev?.kind === "file") revokeIfFile(prev);
      return next;
    });
    syncInputs(next, gallery);
  }

  function clearMainFile() {
    if (main?.kind !== "file") return;
    revokeIfFile(main);
    const restored = defaultImage
      ? ({ kind: "url", src: defaultImage, alt: defaultAlt ?? "" } as UrlPhoto)
      : null;
    setMain(restored);
    syncInputs(restored, gallery);
  }

  function addGalleryFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const additions: FilePhoto[] = [];
    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith("image/")) continue;
      additions.push(makeFilePhoto(file));
    }
    if (!additions.length) return;
    const nextGallery = [...gallery, ...additions];
    setGallery(nextGallery);
    syncInputs(main, nextGallery);
  }

  function removeGallery(key: string) {
    const target = gallery.find((p) => photoKey(p) === key);
    if (target?.kind === "file") revokeIfFile(target);
    const nextGallery = gallery.filter((p) => photoKey(p) !== key);
    setGallery(nextGallery);
    syncInputs(main, nextGallery);
  }

  /** La photo de galerie devient principale ; l’ancienne principale rejoint la galerie. */
  function promoteToMain(key: string) {
    const index = gallery.findIndex((p) => photoKey(p) === key);
    if (index < 0) return;
    const promoted = gallery[index]!;
    const nextGallery = gallery.filter((_, i) => i !== index);
    if (main) nextGallery.unshift(main);
    setMain(promoted);
    setGallery(nextGallery);
    syncInputs(promoted, nextGallery);
  }

  const mainPreview = main ? photoPreview(main) : null;
  const imageUrlValue = main?.kind === "url" ? main.src : "";

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={mainFileId}>Photo principale</Label>
          <div
            className={cn(
              "relative overflow-hidden rounded-xl border border-[#d0d9e6] bg-[#f7f9fc]",
              mainPreview ? "aspect-[16/10]" : "min-h-[160px]"
            )}
          >
            {mainPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- aperçu admin */}
                <img
                  src={mainPreview}
                  alt={defaultAlt || "Aperçu photo principale"}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded bg-orange px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  <Star className="size-3 fill-current" aria-hidden />
                  Principale
                </span>
              </>
            ) : (
              <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 px-4 text-center text-sm text-[#5a6b80]">
                <ImagePlus className="size-8 text-[#9aa8ba]" aria-hidden />
                <p>Choisissez la photo affichée en tête de fiche</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor={mainFileId}
              className="inline-flex h-9 cursor-pointer items-center rounded-lg bg-navy px-3 text-sm font-medium text-white transition-colors hover:bg-navy/90"
            >
              {mainPreview ? "Changer la photo" : "Ajouter une photo"}
            </label>
            <input
              ref={mainFileRef}
              id={mainFileId}
              name="image_file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(e) => onMainFileChange(e.target.files)}
            />
            {main?.kind === "file" ? (
              <>
                <span className="truncate text-sm text-[#5a6b80]">
                  {main.file.name}
                </span>
                <button
                  type="button"
                  onClick={clearMainFile}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#d0d9e6] px-2.5 text-xs font-medium text-[#5a6b80] hover:border-signal hover:text-signal"
                >
                  <X className="size-3.5" aria-hidden />
                  Annuler le fichier
                </button>
              </>
            ) : null}
          </div>
          <p className="text-xs text-[#5a6b80]">
            JPEG, PNG ou WebP — max. 8 Mo. Vous pouvez aussi choisir une photo
            de la galerie ci-dessous.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image_alt">Texte alternatif</Label>
          <Input
            id="image_alt"
            name="image_alt"
            defaultValue={defaultAlt ?? ""}
            placeholder="Ex. Fourgon blanc — vue trois-quarts"
          />
        </div>

        <input type="hidden" name="image" value={imageUrlValue} />

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowUrl((v) => !v)}
            className="text-xs font-semibold text-orange hover:underline"
          >
            {showUrl ? "Masquer l’URL manuelle" : "Ou coller une URL d’image"}
          </button>
          {showUrl ? (
            <Input
              value={imageUrlValue}
              onChange={(e) => {
                const src = e.target.value.trim();
                const next: UrlPhoto | null = src
                  ? { kind: "url", src, alt: defaultAlt ?? "" }
                  : null;
                if (main?.kind === "file") revokeIfFile(main);
                setMain(next);
                syncInputs(next, gallery);
              }}
              placeholder="https://…"
            />
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <Label htmlFor={galleryFileId}>Galerie</Label>
            <p className="mt-1 text-xs text-[#5a6b80]">
              Photos supplémentaires. Cliquez sur l’étoile pour en faire la
              photo principale.
            </p>
          </div>
          <label
            htmlFor={galleryFileId}
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-navy px-3 text-sm font-medium text-white transition-colors hover:bg-navy/90"
          >
            <ImagePlus className="size-4" aria-hidden />
            Ajouter des photos
          </label>
          <input
            ref={galleryFileRef}
            id={galleryFileId}
            name="gallery_files"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="sr-only"
            onChange={(e) => addGalleryFiles(e.target.files)}
          />
        </div>

        {gallery
          .filter((p): p is UrlPhoto => p.kind === "url")
          .map((photo) => (
            <input
              key={photo.src}
              type="hidden"
              name="gallery_existing"
              value={photo.src}
            />
          ))}

        {gallery.length === 0 ? (
          <div className="flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#d0d9e6] bg-[#f7f9fc] px-4 text-center text-sm text-[#5a6b80]">
            <ImagePlus className="size-7 text-[#9aa8ba]" aria-hidden />
            <p>Aucune photo de galerie pour l’instant</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((photo) => (
              <li
                key={photoKey(photo)}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-lg border bg-[#f7f9fc]",
                  photo.kind === "file"
                    ? "border-orange/40"
                    : "border-[#d0d9e6]"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- aperçu admin */}
                <img
                  src={photoPreview(photo)}
                  alt={photo.kind === "url" ? photo.alt : photo.file.name}
                  className="h-full w-full object-cover"
                />
                {photo.kind === "file" ? (
                  <span className="absolute left-1.5 top-1.5 rounded bg-orange px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Nouveau
                  </span>
                ) : null}
                <div className="absolute right-1.5 top-1.5 flex gap-1">
                  <button
                    type="button"
                    onClick={() => promoteToMain(photoKey(photo))}
                    className="inline-flex size-7 items-center justify-center rounded-full bg-navy/85 text-white transition hover:bg-orange"
                    aria-label="Définir comme photo principale"
                    title="Définir comme photo principale"
                  >
                    <Star className="size-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGallery(photoKey(photo))}
                    className="inline-flex size-7 items-center justify-center rounded-full bg-navy/85 text-white transition hover:bg-signal"
                    aria-label="Retirer cette photo"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
