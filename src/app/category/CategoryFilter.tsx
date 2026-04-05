"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

interface Props {
  categories: Category[];
  products: Product[];
}

export default function CategoryFilter({ categories, products }: Props) {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedType, setSelectedType] = useState<"all" | "regular" | "custom">("all");

  const filtered = products.filter((p) => {
    const catMatch = selectedCategory === "all" || p.category === selectedCategory;
    const typeMatch = selectedType === "all" || p.type === selectedType;
    return catMatch && typeMatch;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8" role="toolbar" aria-label="סינון מוצרים">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap" role="group" aria-label="סינון לפי קטגוריה">
          <button
            onClick={() => setSelectedCategory("all")}
            aria-pressed={selectedCategory === "all"}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-primary text-white"
                : "bg-primary/5 text-primary hover:bg-primary/10"
            }`}
          >
            הכל
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              aria-pressed={selectedCategory === cat.slug}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-primary text-white"
                  : "bg-primary/5 text-primary hover:bg-primary/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 border-r-2 border-primary/10 pr-4 sm:mr-4" role="group" aria-label="סינון לפי סוג מוצר">
          <button
            onClick={() => setSelectedType("all")}
            aria-pressed={selectedType === "all"}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === "all"
                ? "bg-accent text-white"
                : "bg-accent/5 text-accent hover:bg-accent/10"
            }`}
          >
            הכל
          </button>
          <button
            onClick={() => setSelectedType("regular")}
            aria-pressed={selectedType === "regular"}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === "regular"
                ? "bg-accent text-white"
                : "bg-accent/5 text-accent hover:bg-accent/10"
            }`}
          >
            רגיל
          </button>
          <button
            onClick={() => setSelectedType("custom")}
            aria-pressed={selectedType === "custom"}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === "custom"
                ? "bg-accent text-white"
                : "bg-accent/5 text-accent hover:bg-accent/10"
            }`}
          >
            בהתאמה אישית
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-primary/40">
          <p className="text-xl">לא נמצאו מוצרים</p>
        </div>
      )}
    </div>
  );
}
