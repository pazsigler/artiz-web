"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Product, CustomFieldsConfig } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
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
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const inWishlist = isInWishlist(product.id);
  // Custom fields config - fall back to all fields for backward compatibility
  const cf: CustomFieldsConfig = product.customFields && Object.keys(product.customFields).length > 0
    ? product.customFields
    : (product.type === "custom" ? { dedication: { maxLength: 0 }, color: { colors: COLORS.map((c) => ({ name: c.name, value: c.value })) }, font: { fonts: FONTS.map((f) => ({ name: f.name, value: f.value })) }, image: true } : {});
  const hasCustomFields = product.type === "custom" && Object.keys(cf).length > 0;
  const cfColors = cf.color?.colors || COLORS;
  const cfFonts = cf.font?.fonts || FONTS;
  const [dedication, setDedication] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedFont, setSelectedFont] = useState(FONTS[0].value);
  const [fileName, setFileName] = useState("");
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const accordionItems = [
    { key: "dimensions", label: "מידות", content: product.dimensions },
    { key: "shipping", label: "משלוחים והחזרות", content: product.shippingInfo },
    { key: "details", label: "פירוט מלא", content: product.fullDetails },
  ].filter((item) => item.content);

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

  const handleQuickBuy = () => {
    handleAdd();
    router.push("/checkout");
  };

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev + 1) % allImages.length);
      if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, allImages.length]);

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
          <div className="bg-sky/20 rounded-2xl aspect-square relative overflow-hidden group">
            {allImages.length > 0 ? (
              <>
                <div
                  className={`absolute inset-0 transition-all duration-300 ease-in-out cursor-zoom-in ${
                    animating
                      ? direction === "left"
                        ? "opacity-0 translate-x-[-20px]"
                        : "opacity-0 translate-x-[20px]"
                      : "opacity-100 translate-x-0"
                  }`}
                  onClick={() => { setLightboxIndex(activeIndex); setLightboxOpen(true); }}
                >
                  <Image
                    src={allImages[activeIndex]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Zoom icon */}
                <button
                  onClick={() => { setLightboxIndex(activeIndex); setLightboxOpen(true); }}
                  className="absolute top-3 left-3 bg-white/80 hover:bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label="הגדל תמונה"
                >
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </button>

                {/* Navigation arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors z-10"
                      aria-label="תמונה קודמת"
                    >
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors z-10"
                      aria-label="תמונה הבאה"
                    >
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
            {hasCustomFields && cf.dedication && dedication && (
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

          {/* Customization Fields - show only enabled fields */}
          {hasCustomFields && (
            <div className="space-y-6 mb-8">
              {/* Dedication */}
              {cf.dedication && (
                <div>
                  <label className="block font-semibold text-primary mb-2">הקדשה</label>
                  <textarea
                    value={dedication}
                    onChange={(e) => {
                      const max = cf.dedication!.maxLength;
                      if (max > 0 && e.target.value.length > max) return;
                      setDedication(e.target.value);
                    }}
                    placeholder="כתוב הקדשה אישית..."
                    maxLength={cf.dedication.maxLength > 0 ? cf.dedication.maxLength : undefined}
                    className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink resize-none h-24"
                  />
                  {cf.dedication.maxLength > 0 && (
                    <p className="text-xs text-primary/40 mt-1">{dedication.length}/{cf.dedication.maxLength} תווים</p>
                  )}
                </div>
              )}

              {/* Color Selection */}
              {cf.color && (
                <div>
                  <label className="block font-semibold text-primary mb-2">בחר צבע</label>
                  <div className="flex gap-3 flex-wrap">
                    {cfColors.map((color) => (
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
              )}

              {/* Font Selection */}
              {cf.font && (
                <div>
                  <label className="block font-semibold text-primary mb-2">בחר פונט</label>
                  <div className="flex gap-3 flex-wrap">
                    {cfFonts.map((font) => (
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
              )}

              {/* File Upload */}
              {cf.image && (
                <div>
                  <label className="block font-semibold text-primary mb-2">העלה תמונה</label>
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
              )}
            </div>
          )}

          {/* Accordion */}
          {accordionItems.length > 0 && (
            <div className="mb-8 border-t border-primary/10">
              {accordionItems.map((item) => (
                <div key={item.key} className="border-b border-primary/10">
                  <h3>
                    <button
                      onClick={() => toggleAccordion(item.key)}
                      className="w-full flex items-center justify-between py-4 text-primary font-semibold hover:text-pink transition-colors"
                      aria-expanded={openAccordion === item.key}
                      aria-controls={`accordion-${item.key}`}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${
                          openAccordion === item.key ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </h3>
                  <div
                    id={`accordion-${item.key}`}
                    role="region"
                    aria-labelledby={`accordion-btn-${item.key}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openAccordion === item.key ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-primary/60 text-sm leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className={`flex-1 py-3 rounded-full font-semibold transition-colors ${
                added
                  ? "bg-green-soft text-white"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {added ? "נוסף לסל ✓" : "הוסף לסל"}
            </button>

            <button
              onClick={handleQuickBuy}
              className="flex-1 py-3 rounded-full font-semibold border-2 border-pink text-pink hover:bg-pink hover:text-white transition-colors"
            >
              רכישה מהירה
            </button>

            {/* Wishlist */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                inWishlist
                  ? "border-pink bg-pink/10"
                  : "border-primary/20 hover:border-pink"
              }`}
              aria-label={inWishlist ? "הסר מהמועדפים" : "הוסף למועדפים"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 transition-colors duration-300 ${
                  inWishlist ? "text-pink" : "text-primary/40"
                }`}
                fill={inWishlist ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="תצוגת תמונה מוגדלת"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 left-4 text-white/70 hover:text-white z-10"
            aria-label="סגור תצוגה"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          {allImages.length > 1 && (
            <div className="absolute top-4 right-4 text-white/50 text-sm" dir="ltr">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          )}

          {/* Image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[lightboxIndex]}
              alt={product.name}
              fill
              className="object-contain animate-fade-in"
              sizes="100vw"
            />
          </div>

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex - 1 + allImages.length) % allImages.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                aria-label="תמונה קודמת"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % allImages.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                aria-label="תמונה הבאה"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </>
          )}

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === lightboxIndex
                      ? "border-white scale-110"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                  aria-label={`תמונה ${i + 1} מתוך ${allImages.length}`}
                >
                  <Image src={img} alt={`${product.name} - תמונה ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
