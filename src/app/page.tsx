import Link from "next/link";
import { getCategories, getProducts, getNewProducts, getHeroSlides } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import CategoryIcon from "@/components/CategoryIcon";
import BulkOrderForm from "@/components/BulkOrderForm";

const circleColors = [
  "bg-accent/15 group-hover:bg-accent/25",
  "bg-sky/25 group-hover:bg-sky/35",
  "bg-lavender/15 group-hover:bg-lavender/25",
  "bg-success/15 group-hover:bg-success/25",
  "bg-warm/15 group-hover:bg-warm/25",
  "bg-accent/10 group-hover:bg-accent/20",
  "bg-sky/20 group-hover:bg-sky/30",
  "bg-lavender/10 group-hover:bg-lavender/20",
];

function SectionHeading({ title, subtitle, light = false }: { title: string; subtitle?: string; light?: boolean }) {
  return (
    <div className="text-center mb-12">
      <h2 className={`text-3xl md:text-4xl font-bold ${light ? "text-white" : "text-primary"} mb-3`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base ${light ? "text-white/60" : "text-primary/50"} mb-4`}>{subtitle}</p>
      )}
      <div className="flex items-center justify-center gap-2">
        <span className="h-[2px] w-8 bg-accent/40 rounded-full" />
        <span className="h-[2px] w-16 bg-accent rounded-full" />
        <span className="h-[2px] w-8 bg-accent/40 rounded-full" />
      </div>
    </div>
  );
}

export const revalidate = 60;

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
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-sky/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 justify-items-center">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/category?cat=${cat.slug}`}
                className="flex flex-col items-center gap-3 group"
              >
                <div
                  className={`${circleColors[i % circleColors.length]} w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-primary/70 group-hover:scale-110 group-hover:text-primary group-hover:shadow-lg transition-all duration-300`}
                >
                  <CategoryIcon slug={cat.slug} className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-semibold text-primary text-sm group-hover:text-accent transition-colors duration-300">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 bg-gradient-to-b from-white to-sky/5 relative">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="חדש באתר" subtitle="המוצרים הכי חדשים שלנו" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-t border-primary/5" />
      </div>

      {/* Popular Products */}
      <section className="py-16 bg-gradient-to-b from-sky/5 to-lavender/5 relative overflow-hidden">
        <div className="absolute top-10 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-0 w-48 h-48 bg-lavender/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 relative">
          <SectionHeading title="הנמכרים ביותר" subtitle="המוצרים שהלקוחות שלנו הכי אוהבים" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/category"
              className="inline-flex items-center gap-2 text-primary border-2 border-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              צפה בכל המוצרים
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Bulk Order Form */}
      <BulkOrderForm />
    </>
  );
}
