import { getSitePageBySlug } from "@/lib/supabase";
import ContactForm from "@/components/ContactForm";

export const revalidate = 60;

export default async function ContactPage() {
  const page = await getSitePageBySlug("contact");
  const content = page?.content || "";

  // Parse structured contact data from content
  const lines = content.split("\n").reduce((acc, line) => {
    const [key, ...rest] = line.split(": ");
    if (key && rest.length) acc[key.trim()] = rest.join(": ").trim();
    return acc;
  }, {} as Record<string, string>);

  const phone = lines["phone"] || "052-6579230";
  const whatsapp = lines["whatsapp"] || phone;
  const email = lines["email"] || "info@artiz.co.il";
  const address = lines["address"] || "";
  const hours = lines["hours"] || "ראשון-חמישי 9:00-18:00";

  const phoneDigits = phone.replace(/\D/g, "");
  const waDigits = whatsapp.replace(/\D/g, "");
  const waNumber = waDigits.startsWith("0") ? "972" + waDigits.slice(1) : waDigits;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary mb-8">צרו קשר</h1>
      <div className="space-y-6 text-primary/70 leading-relaxed">
        <p>נשמח לעמוד לשירותכם בכל שאלה או בקשה.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href={`tel:${phoneDigits}`} className="bg-sky/10 rounded-2xl p-6 hover:bg-sky/20 transition-colors">
            <h3 className="font-bold text-primary mb-2">טלפון</h3>
            <p>{phone}</p>
            <p className="text-sm text-primary/40 mt-1">{hours}</p>
          </a>
          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="bg-sky/10 rounded-2xl p-6 hover:bg-sky/20 transition-colors">
            <h3 className="font-bold text-primary mb-2">וואטסאפ</h3>
            <p>{whatsapp}</p>
            <p className="text-sm text-primary/40 mt-1">זמינים גם בוואטסאפ</p>
          </a>
          <a href={`mailto:${email}`} className="bg-sky/10 rounded-2xl p-6 hover:bg-sky/20 transition-colors">
            <h3 className="font-bold text-primary mb-2">אימייל</h3>
            <p>{email}</p>
            <p className="text-sm text-primary/40 mt-1">נחזור אליכם תוך 24 שעות</p>
          </a>
          <div className="bg-sky/10 rounded-2xl p-6">
            <h3 className="font-bold text-primary mb-2">כתובת</h3>
            <p>{address}</p>
            <p className="text-sm text-primary/40 mt-1">משלוחים לכל הארץ</p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
