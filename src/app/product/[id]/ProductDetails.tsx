"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const COLORS = [
  { name: "ורוד", value: "#f38eb3" },
  { name: "תכלת", value: "#c7e9f2" },
  { name: "סגול", value: "#cc90b7" },
  { name: "ירוק", value: "#b1d9a3" },
  { name: "כתום", value: "#fed194" },
  { name: "צהוב", value: "#fee580" },
  { name: "לבנדר", value: "#d1c4e0" },
];

const FONTS = [
  { name: "רגיל", value: "Rubik" },
  { name: "דקורטיבי", value: "cursive" },
  { name: "מודגש", value: "Rubik-bold" },
];

export default function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [dedication, setDedication] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedFont, setSelectedFont] = useState(FONTS[0].value);
  const [fileName, setFileName] = useState("");
  const [added, setAdded] = useState(false);

  // Gallery state
  const allImages = [product.image, ...(product.gallery || [])].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");

  const goToImage = useCallback((index: number, dir?: "left" | "right") => {
    if (index === activeIndex || animating) return;
    setDirection(dir || (index > activeIndex ? "left" : "right"));
    setAnimating(true);
    setTimeout(() => {
      setActiveIndex(index);
      setTimeout(() => setAnimating(false), 50);
    }, 200);
  }, [activeIndex, animating]);

  const goNext = () => {
    if (allImages.length <= 1) return;
    const next = (activeIndex + 1) % allImages.length;
    goToImage(next, "left");
  };

  const goPrev = () => {
    if (allImages.length <= 1) return;
    const prev = (activeIndex - 1 + allImages.length) % allImages.length;
    goToImage(prev, "right");
  };

  const handleAdd = () => {
    if (product.type === "custom") {
      addItem(product, 1, {
        dedication,
        color: selectedColor,
        font: selectedFont,
        file: fileName,
      });
    } else {
      addItem(product, 1);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button
        onClick={() => router.back()}
        className="text-primary/60 hover:text-primary mb-6 inline-flex items-center gap-1"
      >
        ← חזרה
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image / Gallery */}
        <div>
          {/* Main Image */}
          <div className="bg-sky/20 rounded-2xl aspect-square relative overflow-hidden">
            {allImages.length > 0 ? (
              <>
                <div
                  className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                    animating
                      ? direction === "left"
                        ? "opacity-0 translate-x-[-20px]"
                        : "opacity-0 translate-x-[20px]"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  <Image
                    src={allImages[activeIndex]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Navigation arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors z-10"
                    >
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors z-10"
                    >
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl text-primary/20">🎁</span>
              </div>
            )}

            {/* Custom dedication overlay */}
            {product.type === "custom" && dedication && (
              <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/20 z-10">
                <p
                  className="text-2xl font-semibold break-words max-w-full text-center"
                  style={{
                    color: selectedColor,
                    fontFamily: selectedFont === "Rubik-bold" ? "Rubik" : selectedFont,
                    fontWeight: selectedFont === "Rubik-bold" ? 700 : 400,
                  }}
                >
                  {dedication}
                </p>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => goToImage(i)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                    i === activeIndex
                      ? "border-pink scale-105 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-3xl font-bold text-primary">{product.name}</h1>
            {product.type === "custom" && (
              <span className="bg-pink/10 text-pink text-sm px-3 py-1 rounded-full">
                בהתאמה אישית
              </span>
            )}
          </div>

          <p className="text-primary/60 text-lg mb-4">{product.description}</p>
          <p className="text-3xl font-bold text-primary mb-8">₪{product.price}</p>

          {/* Customization Fields */}
          {product.type === "custom" && (
            <div className="space-y-6 mb-8">
              {/* Dedication */}
              <div>
                <label className="block font-semibold text-primary mb-2">הקדשה</label>
                <textarea
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                  placeholder="כתוב הקדשה אישית..."
                  className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink resize-none h-24"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block font-semibold text-primary mb-2">בחר צבע</label>
                <div className="flex gap-3 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-10 h-10 rounded-full border-2 transition-transform ${
                        selectedColor === color.value
                          ? "border-primary scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Font Selection */}
              <div>
                <label className="block font-semibold text-primary mb-2">בחר פונט</label>
                <div className="flex gap-3 flex-wrap">
                  {FONTS.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setSelectedFont(font.value)}
                      className={`px-4 py-2 rounded-xl border-2 transition-colors ${
                        selectedFont === font.value
                          ? "border-primary bg-primary/5"
                          : "border-primary/20"
                      }`}
                      style={{
                        fontFamily: font.value === "Rubik-bold" ? "Rubik" : font.value,
                        fontWeight: font.value === "Rubik-bold" ? 700 : 400,
                      }}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block font-semibold text-primary mb-2">העלה קובץ</label>
                <label className="flex items-center gap-3 border border-dashed border-primary/30 rounded-xl p-4 cursor-pointer hover:border-pink transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-primary/50">
                    {fileName || "לחץ לבחירת קובץ"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      setFileName(e.target.files?.[0]?.name || "")
                    }
                  />
                </label>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            className={`w-full py-4 rounded-full text-lg font-semibold transition-colors ${
              added
                ? "bg-green-soft text-white"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            {added ? "נוסף לסל ✓" : "הוסף לסל"}
          </button>
        </div>
      </div>
    </div>
  );
}
