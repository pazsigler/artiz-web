# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build
- `npm run lint` — run ESLint

## Architecture

Artiz is a Hebrew RTL eCommerce web app built with Next.js 16 App Router, TypeScript, and Tailwind CSS v4.

### Key Design Decisions

- **Full Hebrew RTL**: `<html lang="he" dir="rtl">` in root layout. All UI text is in Hebrew.
- **Font**: Rubik (loaded via `next/font/google` with `hebrew` subset), set as `--font-rubik` CSS variable.
- **Design system colors** defined in `globals.css` as Tailwind `@theme inline` values: `primary` (#384850), `pink`, `sky`, `purple-soft`, `green-soft`, `orange-soft`, `yellow-soft`, `lavender`, `teal`.
- **Two product types**: `regular` (simple add-to-cart) and `custom` (with dedication text, color picker, font picker, file upload, and live preview).
- **Client-side cart** managed via React Context (`CartContext`). The `CartProvider` wraps the entire app in the root layout.
- **Static data** in `src/lib/data.ts` — will be replaced with Supabase when backend is integrated.

### Route Structure

- `/` — homepage (hero, categories, popular products)
- `/category` — product grid with category + type filters (uses `useSearchParams`, wrapped in `Suspense`)
- `/product/[id]` — product detail page; server component loads data, delegates to `ProductDetails` client component
- `/cart` — cart page
- `/checkout` — checkout form (name, phone, address)

### Patterns

- Server components fetch data and pass to client components for interactivity (see `product/[id]/page.tsx` → `ProductDetails.tsx`).
- Components using `useSearchParams` must be wrapped in `<Suspense>` for static generation compatibility.
- Product images are placeholder emoji for now — replace with actual `<Image>` components when assets are available.
