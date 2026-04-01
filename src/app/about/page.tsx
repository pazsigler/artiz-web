import Image from "next/image";
import { getSitePageBySlug } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const page = await getSitePageBySlug("about");

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary mb-8">{page?.title || "אודות"}</h1>
      {page?.image && (
        <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <Image src={page.image} alt={page.title} fill className="object-cover" />
        </div>
      )}
      <div className="text-primary/70 leading-relaxed whitespace-pre-wrap">
        {page?.content || ""}
      </div>
    </div>
  );
}
