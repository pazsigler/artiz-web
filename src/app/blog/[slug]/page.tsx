import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogPostBySlug } from "@/lib/supabase";

export const revalidate = 60;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="py-16 bg-white min-h-[60vh]">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/blog" className="text-accent hover:text-accent/80 text-sm font-semibold mb-8 inline-block">
          &larr; חזרה לבלוג
        </Link>

        <time className="block text-sm text-primary/40 mb-2">
          {new Date(post.createdAt).toLocaleDateString("he-IL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">{post.title}</h1>

        {post.image && (
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-primary/80 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </div>
    </article>
  );
}
