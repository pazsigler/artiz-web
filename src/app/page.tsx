import Link from "next/link";
import { getCategories, getProducts, getNewProducts, getHeroSlides } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import CategoryIcon from "@/components/CategoryIcon";
import BulkOrderForm from "@/components/BulkOrderForm";

const circleColors = [
  "bg-pink/15",
  "bg-sky/20",
  "bg-purple-soft/15",
  "bg-green-soft/15",
  "bg-orange-soft/15",
  "bg-lavender/15",
  "bg-yellow-soft/15",
  "bg-teal/15",
];

export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  const [categories, products, newProducts, heroSlides] = await Promise.all([
    getCategories(),
    getProducts(),
    getNewProducts(),
    getHeroSlides(),
  ]);

  const popularProducts = products.slice(0, 4);

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 md:grid-cols-8 gap-6 justify-items-center">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/category?cat=${cat.slug}`}
                className="flex flex-col items-center gap-3 group"
              >
                <div
                  className={`${circleColors[i % circleColors.length]} w-20 h-20 rounded-full flex items-center justify-center text-primary/70 group-hover:scale-110 group-hover:text-primary transition-all duration-200`}
                >
                  <CategoryIcon slug={cat.slug} className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-primary text-sm group-hover:text-pink transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-10">
            חדש באתר
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 bg-sky/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-10">
            מוצרים פופולריים
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/category"
              className="text-primary border-2 border-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              צפה בכל המוצרים
            </Link>
          </div>
        </div>
      </section>

      {/* Bulk Order Form */}
      <BulkOrderForm />
    </>
  );
}
