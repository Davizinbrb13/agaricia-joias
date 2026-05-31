const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Sobe uma imagem direto do navegador para o Cloudinary (upload unsigned).
 * Retorna o `public_id` (preferível ao secure_url, pois permite as
 * transformações de `lib/cloudinary.ts`, ex.: thumbnail 400x400).
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!CLOUD || !PRESET) {
    throw new Error(
      "Cloudinary não configurado: defina NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME e NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    const errBody = (await res.json().catch(() => ({}))) as {
      error?: { message?: string };
    };
    const detail = errBody.error?.message;
    throw new Error(
      detail ? `Cloudinary: ${detail}` : "Falha no upload da imagem para o Cloudinary."
    );
  }

  const data = (await res.json()) as {
    public_id?: string;
    secure_url?: string;
  };

  const id = data.public_id ?? data.secure_url;
  if (!id) {
    throw new Error("Cloudinary não retornou identificador da imagem.");
  }
  return id;
}
