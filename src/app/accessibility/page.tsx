import { getSitePageBySlug } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AccessibilityPage() {
  const page = await getSitePageBySlug("accessibility");

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary mb-8">{page?.title || "הצהרת נגישות"}</h1>
      <div className="text-primary/70 leading-relaxed whitespace-pre-wrap">
        {page?.content || ""}
      </div>
    </div>
  );
}
