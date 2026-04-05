"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

const steps = [
  { label: "סל קניות", icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" },
  { label: "פרטי משלוח", icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" },
  { label: "אישור הזמנה", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const INPUT_CLASS = "w-full border border-primary/15 rounded-xl p-3.5 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all text-sm";

// Israeli cities autocomplete using data.gov.il API
function useCityAutocomplete() {
  const [cities, setCities] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    fetch(
      'https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4571-b4d8-571e2f1ae6e4&limit=2000&fields=שם_ישוב'
    )
      .then((r) => r.json())
      .then((data) => {
        const names: string[] = data.result.records
          .map((r: Record<string, string>) => r["שם_ישוב"]?.trim())
          .filter(Boolean)
          .sort((a: string, b: string) => a.localeCompare(b, "he"));
        setCities(names);
        setLoaded(true);
      })
      .catch(() => {
        // Fallback: allow free text
        setLoaded(true);
      });
  }, [loaded]);

  return cities;
}

function CityInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const cities = useCityAutocomplete();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleChange = useCallback(
    (v: string) => {
      onChange(v);
      if (v.trim().length > 0 && cities.length > 0) {
        const q = v.trim();
        const matches = cities.filter((c) => c.includes(q)).slice(0, 8);
        setSuggestions(matches);
        setOpen(matches.length > 0);
      } else {
        setSuggestions([]);
        setOpen(false);
      }
    },
    [cities, onChange]
  );

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        required
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
        className={INPUT_CLASS}
        placeholder="הקלד שם עיר..."
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 top-full mt-1 w-full bg-white border border-primary/10 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((city) => (
            <li key={city}>
              <button
                type="button"
                className="w-full text-right px-4 py-2.5 text-sm hover:bg-sky/10 transition-colors"
                onClick={() => {
                  onChange(city);
                  setOpen(false);
                }}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    street: "",
    streetNumber: "",
    apartment: "",
    floor: "",
  });
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoice, setInvoice] = useState({
    name: "",
    phone: "",
    address: "",
    businessNumber: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) return null;

  const buildAddress = () => {
    let addr = `${form.street} ${form.streetNumber}, ${form.city}`;
    if (form.apartment) addr += `, דירה ${form.apartment}`;
    if (form.floor) addr += `, קומה ${form.floor}`;
    return addr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createOrder({
        fullName: form.fullName,
        phone: form.phone,
        address: buildAddress(),
        total: totalPrice,
        userId: user?.id,
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          customization: item.customization,
        })),
      });
      clearCart();
      router.push("/");
      alert("ההזמנה נשלחה בהצלחה!");
    } catch {
      alert("שגיאה בשליחת ההזמנה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateInvoice = (field: string, value: string) => setInvoice((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Progress steps */}
      <div className="flex items-center justify-center mb-12">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${
                  i <= 1
                    ? "bg-accent text-white"
                    : "bg-primary/5 text-primary/30"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                </svg>
              </div>
              <span className={`text-xs mt-2 font-semibold ${i <= 1 ? "text-primary" : "text-primary/30"}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 md:w-24 h-[2px] mx-2 mb-5 ${i < 1 ? "bg-accent" : "bg-primary/10"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary mb-6">פרטי משלוח</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block font-semibold text-primary mb-2 text-sm">שם מלא</label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => updateForm("fullName", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="הכנס שם מלא"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block font-semibold text-primary mb-2 text-sm">טלפון</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="050-0000000"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Address section */}
            <div className="border border-primary/10 rounded-2xl p-4 md:p-5 space-y-4">
              <h2 className="font-bold text-primary text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                כתובת משלוח
              </h2>

              {/* City, Street, Number - required */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block font-semibold text-primary mb-2 text-sm">
                    עיר <span className="text-accent">*</span>
                  </label>
                  <CityInput value={form.city} onChange={(v) => updateForm("city", v)} />
                </div>
                <div>
                  <label htmlFor="street" className="block font-semibold text-primary mb-2 text-sm">
                    רחוב <span className="text-accent">*</span>
                  </label>
                  <input
                    id="street"
                    type="text"
                    required
                    value={form.street}
                    onChange={(e) => updateForm("street", e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="שם הרחוב"
                  />
                </div>
                <div>
                  <label htmlFor="streetNumber" className="block font-semibold text-primary mb-2 text-sm">
                    מספר <span className="text-accent">*</span>
                  </label>
                  <input
                    id="streetNumber"
                    type="text"
                    required
                    value={form.streetNumber}
                    onChange={(e) => updateForm("streetNumber", e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="מספר"
                  />
                </div>
              </div>

              {/* Apartment, Floor - optional */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="apartment" className="block font-semibold text-primary mb-2 text-sm">דירה</label>
                  <input
                    id="apartment"
                    type="text"
                    value={form.apartment}
                    onChange={(e) => updateForm("apartment", e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="דירה"
                  />
                </div>
                <div>
                  <label htmlFor="floor" className="block font-semibold text-primary mb-2 text-sm">קומה</label>
                  <input
                    id="floor"
                    type="text"
                    value={form.floor}
                    onChange={(e) => updateForm("floor", e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="קומה"
                  />
                </div>
              </div>
            </div>

            {/* Invoice details toggle */}
            <div className="border border-primary/10 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowInvoice(!showInvoice)}
                className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-sky/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${showInvoice ? "bg-accent border-accent" : "border-primary/20"}`}>
                    {showInvoice && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <span className="font-semibold text-primary text-sm">פרטים שונים עבור חשבונית</span>
                </div>
                <svg className={`w-4 h-4 text-primary/30 transition-transform duration-300 ${showInvoice ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showInvoice ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-4 md:px-5 pb-4 md:pb-5 space-y-4 border-t border-primary/5 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="invoiceName" className="block font-semibold text-primary mb-2 text-sm">
                        שם לחשבונית <span className="text-accent">*</span>
                      </label>
                      <input
                        id="invoiceName"
                        type="text"
                        required={showInvoice}
                        value={invoice.name}
                        onChange={(e) => updateInvoice("name", e.target.value)}
                        className={INPUT_CLASS}
                        placeholder="שם מלא / שם חברה"
                      />
                    </div>
                    <div>
                      <label htmlFor="invoicePhone" className="block font-semibold text-primary mb-2 text-sm">
                        טלפון <span className="text-accent">*</span>
                      </label>
                      <input
                        id="invoicePhone"
                        type="tel"
                        required={showInvoice}
                        value={invoice.phone}
                        onChange={(e) => updateInvoice("phone", e.target.value)}
                        className={INPUT_CLASS}
                        placeholder="050-0000000"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="invoiceAddress" className="block font-semibold text-primary mb-2 text-sm">
                      כתובת <span className="text-accent">*</span>
                    </label>
                    <input
                      id="invoiceAddress"
                      type="text"
                      required={showInvoice}
                      value={invoice.address}
                      onChange={(e) => updateInvoice("address", e.target.value)}
                      className={INPUT_CLASS}
                      placeholder="כתובת לחשבונית"
                    />
                  </div>
                  <div>
                    <label htmlFor="invoiceBusiness" className="block font-semibold text-primary mb-2 text-sm">
                      מספר עסק / ח.פ <span className="text-primary/30">(אופציונלי)</span>
                    </label>
                    <input
                      id="invoiceBusiness"
                      type="text"
                      value={invoice.businessNumber}
                      onChange={(e) => updateInvoice("businessNumber", e.target.value)}
                      className={INPUT_CLASS}
                      placeholder="מספר עוסק / ח.פ."
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 py-4">
              <div className="flex flex-col items-center text-center gap-2 py-3">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span className="text-xs text-primary/50 font-medium">רכישה מאובטחת</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 py-3">
                <svg className="w-6 h-6 text-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span className="text-xs text-primary/50 font-medium">משלוח לכל הארץ</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 py-3">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <span className="text-xs text-primary/50 font-medium">יצירה כחול לבן</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-4 rounded-full text-lg font-semibold hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:shadow-accent/20"
            >
              {loading ? "שולח הזמנה..." : "אישור הזמנה"}
            </button>

            <Link
              href="/cart"
              className="block text-center text-primary/40 hover:text-primary text-sm transition-colors"
            >
              חזרה לסל הקניות
            </Link>
          </form>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-primary/5 p-6 lg:sticky lg:top-24">
            <h2 className="font-bold text-primary text-lg mb-4">סיכום הזמנה</h2>

            <div className="space-y-4 mb-4 max-h-72 overflow-y-auto">
              {items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-sky/10 flex-shrink-0 relative">
                    {item.product.image ? (
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="56px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{item.product.name}</p>
                    <p className="text-xs text-primary/40">כמות: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary flex-shrink-0">
                    ₪{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-primary/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-primary/60">
                <span>סכום ביניים</span>
                <span>₪{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-primary/60">
                <span>משלוח</span>
                <span>ייקבע בהמשך</span>
              </div>
              <div className="border-t border-primary/10 pt-3 flex justify-between text-xl font-bold text-primary">
                <span>סה&quot;כ</span>
                <span>₪{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
