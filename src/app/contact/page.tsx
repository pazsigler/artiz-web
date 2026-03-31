export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary mb-8">צרו קשר</h1>
      <div className="space-y-6 text-primary/70 leading-relaxed">
        <p>נשמח לעמוד לשירותכם בכל שאלה או בקשה.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="tel:0526579230" className="bg-sky/10 rounded-2xl p-6 hover:bg-sky/20 transition-colors">
            <h3 className="font-bold text-primary mb-2">טלפון</h3>
            <p>052-6579230</p>
            <p className="text-sm text-primary/40 mt-1">א׳-ה׳ 9:00-18:00</p>
          </a>
          <a href="https://wa.me/972526579230" target="_blank" rel="noopener noreferrer" className="bg-sky/10 rounded-2xl p-6 hover:bg-sky/20 transition-colors">
            <h3 className="font-bold text-primary mb-2">וואטסאפ</h3>
            <p>052-6579230</p>
            <p className="text-sm text-primary/40 mt-1">זמינים גם בוואטסאפ</p>
          </a>
          <a href="mailto:info@artiz.co.il" className="bg-sky/10 rounded-2xl p-6 hover:bg-sky/20 transition-colors">
            <h3 className="font-bold text-primary mb-2">אימייל</h3>
            <p>info@artiz.co.il</p>
            <p className="text-sm text-primary/40 mt-1">נחזור אליכם תוך 24 שעות</p>
          </a>
          <div className="bg-sky/10 rounded-2xl p-6">
            <h3 className="font-bold text-primary mb-2">כתובת</h3>
            <p>קרית שמונה</p>
            <p className="text-sm text-primary/40 mt-1">משלוחים לכל הארץ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
