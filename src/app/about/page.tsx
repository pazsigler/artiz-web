import Image from "next/image";
import Link from "next/link";
import { getSitePageBySlug } from "@/lib/supabase";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "אודות ארטיז | מתנות ויודאיקה בעיצוב אישי",
  description:
    "ארטיז - חנות מתנות ויודאיקה ישראלית. מוצרים מקוריים בעיצוב אישי לחגים, גיוס, ימי הולדת ואירועים. משלוחים לכל הארץ.",
};

export default async function AboutPage() {
  const page = await getSitePageBySlug("about");
  const content = page?.content || "";

  // Split content into paragraphs, detect headings (lines ending with ? or lines that are short and bold-like)
  const sections = content.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-[60vh]">
      {/* Hero */}
      <div className="bg-gradient-to-l from-pink/10 to-sky/10 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{page?.title || "אודות"}</h1>
          {sections[0] && (
            <p className="text-lg text-primary/60 max-w-2xl mx-auto">{sections[0]}</p>
          )}
        </div>
      </div>

      {page?.image && (
        <div className="max-w-4xl mx-auto px-4 -mt-8">
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg">
            <Image src={page.image} alt={page.title} fill className="object-cover" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-6 text-primary/70 leading-relaxed">
          {sections.slice(1).map((section, i) => {
            const lines = section.split("\n");
            const firstLine = lines[0];
            // Detect heading-like lines (short lines that could be titles)
            const isHeading = firstLine.length < 40 && !firstLine.includes(":");

            if (isHeading && lines.length > 1) {
              return (
                <div key={i}>
                  <h2 className="text-xl font-bold text-primary mb-3">{firstLine}</h2>
                  <div className="whitespace-pre-wrap">{lines.slice(1).join("\n")}</div>
                </div>
              );
            }
            return (
              <p key={i} className="whitespace-pre-wrap">{section}</p>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-sky/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-3">מוכנים למצוא את המתנה המושלמת?</h2>
          <p className="text-primary/60 mb-6">גלו את מגוון המוצרים שלנו ומצאו בדיוק מה שחיפשתם</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/category"
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
            >
              צפו במוצרים
            </Link>
            <Link
              href="/contact"
              className="border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              צרו קשר
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
