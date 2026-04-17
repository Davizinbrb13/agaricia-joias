const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const BASE = `https://res.cloudinary.com/${CLOUD}/image/upload`;

type Transformation = {
  width?: number;
  height?: number;
  quality?: "auto" | number;
  format?: "auto" | "webp" | "jpg";
  crop?: "fill" | "fit" | "thumb" | "pad";
  gravity?: "auto" | "face" | "center";
  background?: string;
};

export function cloudinaryUrl(
  publicId: string,
  t: Transformation = {}
): string {
  // Se o n8n ou banco já enviaram o link completo, apenas retorna ele
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId;
  }

  const parts: string[] = [];
  if (t.width) parts.push(`w_${t.width}`);
  if (t.height) parts.push(`h_${t.height}`);
  if (t.crop) parts.push(`c_${t.crop}`);
  if (t.gravity) parts.push(`g_${t.gravity}`);
  if (t.background) parts.push(`b_${t.background}`);
  parts.push(`q_${t.quality ?? "auto"}`);
  parts.push(`f_${t.format ?? "auto"}`);
  const transform = parts.join(",");
  return `${BASE}/${transform}/${publicId}`;
}

/** Thumbnail 400x400 para cards do catálogo */
export const productThumbnail = (id: string) =>
  cloudinaryUrl(id, {
    width: 400,
    height: 400,
    crop: "fill",
    gravity: "auto",
    background: "white",
    quality: "auto",
  });

/** Imagem grande 800x800 para página de produto */
export const productHero = (id: string) =>
  cloudinaryUrl(id, {
    width: 800,
    height: 800,
    crop: "pad",
    background: "white",
    quality: "auto",
  });

/** Imagem da galeria 600x600 */
export const productGallery = (id: string) =>
  cloudinaryUrl(id, {
    width: 600,
    height: 600,
    crop: "fill",
    quality: "auto",
  });

/** Open Graph image 1200x630 */
export const ogImage = (id: string) =>
  cloudinaryUrl(id, {
    width: 1200,
    height: 630,
    crop: "fill",
    gravity: "auto",
    quality: "auto",
  });
