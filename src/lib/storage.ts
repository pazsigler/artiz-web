import { supabase } from "./supabase";

const BUCKET = "product-images";

export interface MediaFile {
  name: string;
  folder: string;
  url: string;
  createdAt: string;
  size: number;
}

const MEDIA_FOLDERS = ["products", "blog", "pages", "slides", "media"];

export async function listAllMedia(): Promise<MediaFile[]> {
  const all: MediaFile[] = [];

  for (const folder of MEDIA_FOLDERS) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(folder, { limit: 500, sortBy: { column: "created_at", order: "desc" } });

    if (error || !data) continue;

    for (const file of data) {
      if (!file.name || file.name === ".emptyFolderPlaceholder") continue;
      const path = `${folder}/${file.name}`;
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      all.push({
        name: file.name,
        folder,
        url: urlData.publicUrl,
        createdAt: file.created_at || "",
        size: file.metadata?.size || 0,
      });
    }
  }

  return all.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
}

export async function uploadMediaFile(file: File, folder = "media"): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `${folder}/${fileName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteMediaFile(url: string): Promise<void> {
  const path = url.split(`/${BUCKET}/`)[1];
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function deleteProductImage(url: string): Promise<void> {
  const path = url.split("/product-images/")[1];
  if (!path) return;
  await supabase.storage.from("product-images").remove([path]);
}

export async function uploadBlogImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `blog/${fileName}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function uploadPageImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `pages/${fileName}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function uploadSlideImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `slides/${fileName}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);

  return data.publicUrl;
}
