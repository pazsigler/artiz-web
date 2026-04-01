import { createClient } from "@supabase/supabase-js";
import { Product, Category, HeroSlide, BlogPost, SitePage } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at");
  if (error) throw error;
  return data.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image || "",
  }));
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at");
  if (error) throw error;
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image || "",
    gallery: p.gallery || [],
    category: p.category_slug,
    type: p.type,
    description: p.description || "",
    dimensions: p.dimensions || "",
    shippingInfo: p.shipping_info || "",
    fullDetails: p.full_details || "",
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return {
    id: data.id,
    name: data.name,
    price: data.price,
    image: data.image || "",
    gallery: data.gallery || [],
    category: data.category_slug,
    type: data.type,
    description: data.description || "",
    dimensions: data.dimensions || "",
    shippingInfo: data.shipping_info || "",
    fullDetails: data.full_details || "",
  };
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", ids);
  if (error) throw error;
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image || "",
    gallery: p.gallery || [],
    category: p.category_slug,
    type: p.type,
    description: p.description || "",
    dimensions: p.dimensions || "",
    shippingInfo: p.shipping_info || "",
    fullDetails: p.full_details || "",
  }));
}

export async function getNewProducts(limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image || "",
    gallery: p.gallery || [],
    category: p.category_slug,
    type: p.type,
    description: p.description || "",
    dimensions: p.dimensions || "",
    shippingInfo: p.shipping_info || "",
    fullDetails: p.full_details || "",
  }));
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw error;
  return data.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle || "",
    cta: s.cta,
    href: s.href,
    imageDesktop: s.image_desktop || "",
    imageMobile: s.image_mobile || "",
  }));
}

export async function createOrder(order: {
  fullName: string;
  phone: string;
  address: string;
  total: number;
  items: unknown[];
  userId?: string;
}) {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      full_name: order.fullName,
      phone: order.phone,
      address: order.address,
      total: order.total,
      items: order.items,
      user_id: order.userId || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Blog
export async function getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (publishedOnly) query = query.eq("published", true);
  const { data, error } = await query;
  if (error) throw error;
  return data.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    content: p.content || "",
    excerpt: p.excerpt || "",
    image: p.image || "",
    published: p.published,
    authorId: p.author_id,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    content: data.content || "",
    excerpt: data.excerpt || "",
    image: data.image || "",
    published: data.published,
    authorId: data.author_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Site Pages
export async function getSitePages(): Promise<SitePage[]> {
  const { data, error } = await supabase.from("site_pages").select("*").order("slug");
  if (error) throw error;
  return data.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    content: p.content || "",
    image: p.image || "",
    updatedAt: p.updated_at,
  }));
}

export async function getSitePageBySlug(slug: string): Promise<SitePage | null> {
  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    content: data.content || "",
    image: data.image || "",
    updatedAt: data.updated_at,
  };
}
