export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary mb-8">הצהרת נגישות</h1>
      <div className="space-y-6 text-primary/70 leading-relaxed">
        <h2 className="text-xl font-bold text-primary">מחויבות לנגישות</h2>
        <p>Artiz מחויבת להנגשת האתר לאנשים עם מוגבלויות, בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013 ולתקן הישראלי ת&quot;י 5568.</p>

        <h2 className="text-xl font-bold text-primary">פעולות שביצענו</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>התאמת האתר לדפדפנים ולטכנולוגיות מסייעות</li>
          <li>שימוש בניגודיות צבעים ברורה</li>
          <li>תמיכה בניווט מקלדת</li>
          <li>תיאורי תמונות חלופיים</li>
          <li>מבנה כותרות היררכי</li>
        </ul>

        <h2 className="text-xl font-bold text-primary">נתקלתם בבעיה?</h2>
        <p>אם נתקלתם בבעיית נגישות באתר, נשמח לשמוע ולטפל בהקדם.</p>
        <p>ניתן לפנות אלינו:</p>
        <ul className="list-disc pr-6 space-y-1">
          <li>אימייל: info@artiz.co.il</li>
          <li>טלפון: 050-0000000</li>
        </ul>

        <p className="text-sm text-primary/40">הצהרה זו עודכנה לאחרונה בתאריך {new Date().toLocaleDateString("he-IL")}.</p>
      </div>
    </div>
  );
}
