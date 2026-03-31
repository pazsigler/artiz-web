import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-sky/30 flex items-center justify-center relative overflow-hidden">
        {product.image ? (
          <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <span className="text-4xl text-primary/30">🎁</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-primary group-hover:text-pink transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-primary/60 mt-1">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">₪{product.price}</span>
          {product.type === "custom" && (
            <span className="text-xs bg-pink/10 text-pink px-2 py-1 rounded-full">
              בהתאמה אישית
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
