export type ProductType = "regular" | "custom";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  type: ProductType;
  description: string;
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
  bgGradient: string;
  emoji: string;
}
