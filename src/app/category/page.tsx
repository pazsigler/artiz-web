import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/supabase";
import CategoryFilter from "./CategoryFilter";

export const revalidate = 60;

export default async function CategoryPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">כל המוצרים</h1>
      <Suspense>
        <CategoryFilter categories={categories} products={products} />
      </Suspense>
    </div>
  );
}
