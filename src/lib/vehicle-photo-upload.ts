import type { SupabaseClient } from "@supabase/supabase-js";

export const VEHICLE_PHOTOS_BUCKET = "vehicle-photos";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 8 * 1024 * 1024; // 8 Mo

function extensionFor(mime: string, fileName: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  const fromName = fileName.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  return "jpg";
}

function assertValidImage(file: File, label: string) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error(
      `${label} : format non supporté (JPEG, PNG, WebP ou GIF uniquement).`
    );
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`${label} : max. 8 Mo par fichier.`);
  }
}

async function uploadVehiclePhoto(
  supabase: SupabaseClient,
  file: File,
  slug: string,
  kind: "main" | "gallery",
  index = 0
): Promise<string> {
  const label = kind === "main" ? "Photo principale" : `Galerie photo ${index + 1}`;
  assertValidImage(file, label);

  const ext = extensionFor(file.type, file.name);
  const stamp = Date.now();
  const path =
    kind === "main"
      ? `${slug}/main-${stamp}.${ext}`
      : `${slug}/gallery-${stamp}-${index}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(VEHICLE_PHOTOS_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(`Upload ${label.toLowerCase()} : ${error.message}`);
  }

  const { data } = supabase.storage
    .from(VEHICLE_PHOTOS_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

/** Upload la photo principale. */
export async function uploadVehicleMainPhoto(
  supabase: SupabaseClient,
  file: File,
  slug: string
): Promise<string> {
  return uploadVehiclePhoto(supabase, file, slug, "main");
}

function mimeFromContentType(header: string | null): string {
  const raw = (header ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
  if (ALLOWED_TYPES.has(raw)) return raw;
  return "image/jpeg";
}

/**
 * Télécharge une URL distante (ex. Facebook CDN) et la stocke dans le bucket
 * public. Retourne l’URL publique Supabase, ou `null` si le téléchargement échoue.
 */
export async function mirrorRemoteVehiclePhoto(
  supabase: SupabaseClient,
  remoteUrl: string,
  slug: string,
  kind: "main" | "gallery",
  index = 0
): Promise<string | null> {
  const url = remoteUrl.trim();
  if (!url || !/^https?:\/\//i.test(url)) return null;

  // Déjà hébergé chez nous
  if (url.includes("/storage/v1/object/public/vehicle-photos/")) {
    return url;
  }

  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MasOcasBot/1.0; +https://masocas.fr)",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: "https://www.facebook.com/",
      },
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) return null;

    const contentType = mimeFromContentType(res.headers.get("content-type"));
    const buffer = Buffer.from(await res.arrayBuffer());
    if (!buffer.length || buffer.length > MAX_BYTES) return null;

    const ext = extensionFor(contentType, url);
    const stamp = Date.now();
    const path =
      kind === "main"
        ? `${slug}/main-${stamp}.${ext}`
        : `${slug}/gallery-${stamp}-${index}.${ext}`;

    const { error } = await supabase.storage
      .from(VEHICLE_PHOTOS_BUCKET)
      .upload(path, buffer, {
        contentType,
        upsert: true,
        cacheControl: "31536000",
      });
    if (error) {
      console.error("[photos] mirror upload failed:", error.message);
      return null;
    }

    const { data } = supabase.storage
      .from(VEHICLE_PHOTOS_BUCKET)
      .getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error("[photos] mirror fetch failed:", err);
    return null;
  }
}

/** Miroir image principale + galerie ; conserve l’URL d’origine si échec. */
export async function mirrorVehicleImageFields(
  supabase: SupabaseClient,
  slug: string,
  image: string,
  gallery: { src: string; alt: string }[] | null | undefined
): Promise<{
  image: string;
  gallery: { src: string; alt: string }[] | null;
}> {
  const mirroredMain =
    (await mirrorRemoteVehiclePhoto(supabase, image, slug, "main")) ?? image;

  if (!gallery?.length) {
    return { image: mirroredMain, gallery: null };
  }

  const nextGallery: { src: string; alt: string }[] = [];
  for (let i = 0; i < gallery.length; i++) {
    const item = gallery[i]!;
    const mirrored =
      (await mirrorRemoteVehiclePhoto(
        supabase,
        item.src,
        slug,
        "gallery",
        i
      )) ?? item.src;
    nextGallery.push({ ...item, src: mirrored });
  }

  return { image: mirroredMain, gallery: nextGallery };
}

/** Upload plusieurs photos de galerie. */
export async function uploadVehicleGalleryPhotos(
  supabase: SupabaseClient,
  files: File[],
  slug: string
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;
    urls.push(await uploadVehiclePhoto(supabase, file, slug, "gallery", i));
  }
  return urls;
}

export function formFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  if (!(value instanceof File) || value.size === 0) return null;
  return value;
}

export function formFiles(formData: FormData, key: string): File[] {
  return formData
    .getAll(key)
    .filter((v): v is File => v instanceof File && v.size > 0);
}

/** URLs déjà en galerie que l’utilisateur a choisi de conserver. */
export function formExistingGalleryUrls(formData: FormData): string[] {
  return formData
    .getAll("gallery_existing")
    .map((v) => String(v).trim())
    .filter(Boolean);
}

export function buildGalleryItems(
  urls: string[],
  altFallback: string
): { src: string; alt: string }[] | null {
  if (!urls.length) return null;
  return urls.map((src, i) => ({
    src,
    alt: i === 0 ? altFallback : `${altFallback} — photo ${i + 1}`,
  }));
}
