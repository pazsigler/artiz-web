export type ProductType = "regular" | "custom";

export interface ColorOption {
  name: string;
  value: string;
}

export interface FontOption {
  name: string;
  value: string;
}

export interface CustomFieldsConfig {
  dedication?: { maxLength: number };
  color?: { colors: ColorOption[] };
  font?: { fonts: FontOption[] };
  image?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  gallery: string[];
  category: string;
  type: ProductType;
  description: string;
  dimensions: string;
  shippingInfo: string;
  fullDetails: string;
  customFields: CustomFieldsConfig;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: {
    dedication?: string;
    color?: string;
    font?: string;
    file?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  imageDesktop: string;
  imageMobile: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  published: boolean;
  authorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SitePage {
  id: string;
  slug: string;
  title: string;
  content: string;
  image: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrder: number;
  maxDiscount: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
}

export type UserRole = "customer" | "admin" | "editor";

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string;
  role: UserRole;
  created_at: string;
}
