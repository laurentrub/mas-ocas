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
