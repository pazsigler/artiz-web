import { getProductById } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return notFound();

  return <ProductDetails product={product} />;
}
