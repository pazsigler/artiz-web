import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <Image src="/logo-white.svg" alt="Artiz" width={100} height={53} className="mb-3" />
        <p className="text-sm text-white/70">
          מתנות ומוצרים בעיצוב אישי &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
