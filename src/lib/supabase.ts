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
    customFields: p.custom_fields || {},
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
    customFields: data.custom_fields || {},
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
    customFields: p.custom_fields || {},
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
    customFields: p.custom_fields || {},
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

// Coupons
export interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order: number;
  max_discount: number | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
}

export async function validateCoupon(code: string, orderTotal: number): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .single();

  if (error || !data) return { valid: false, error: "קופון לא נמצא" };

  const coupon = data as Coupon;

  if (!coupon.active) return { valid: false, error: "קופון לא פעיל" };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return { valid: false, error: "פג תוקף הקופון" };
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) return { valid: false, error: "הקופון נוצל עד תום" };
  if (orderTotal < coupon.min_order) return { valid: false, error: `סכום הזמנה מינימלי: ₪${coupon.min_order}` };

  return { valid: true, coupon };
}

export function calcDiscount(coupon: Coupon, orderTotal: number): number {
  let discount = 0;
  if (coupon.discount_type === "percentage") {
    discount = (orderTotal * coupon.discount_value) / 100;
    if (coupon.max_discount && discount > coupon.max_discount) {
      discount = coupon.max_discount;
    }
  } else {
    discount = coupon.discount_value;
  }
  return Math.min(discount, orderTotal);
}

export async function incrementCouponUsage(couponId: string) {
  await supabase.rpc("increment_coupon_usage", { coupon_id: couponId }).then(() => {}).catch(() => {
    // Fallback: manual increment
    supabase
      .from("coupons")
      .select("used_count")
      .eq("id", couponId)
      .single()
      .then(({ data }) => {
        if (data) {
          supabase.from("coupons").update({ used_count: data.used_count + 1 }).eq("id", couponId);
        }
      });
  });
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
