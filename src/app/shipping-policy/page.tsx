export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary mb-8">מדיניות משלוחים</h1>
      <div className="space-y-6 text-primary/70 leading-relaxed">
        <h2 className="text-xl font-bold text-primary">זמני אספקה</h2>
        <p>משלוחים מבוצעים בימים א׳-ה׳. זמן האספקה הוא 3-5 ימי עסקים מרגע ביצוע ההזמנה.</p>
        <p>מוצרים בהתאמה אישית עשויים לדרוש זמן הכנה נוסף של 2-3 ימי עסקים.</p>

        <h2 className="text-xl font-bold text-primary">עלות משלוח</h2>
        <p>משלוח רגיל: ₪30</p>
        <p>משלוח אקספרס (1-2 ימי עסקים): ₪50</p>
        <p>משלוח חינם בהזמנות מעל ₪300.</p>

        <h2 className="text-xl font-bold text-primary">מדיניות החזרות</h2>
        <p>ניתן להחזיר מוצרים תוך 14 יום מקבלת המשלוח, בתנאי שהמוצר לא נפגם ובאריזתו המקורית.</p>
        <p>מוצרים בהתאמה אישית אינם ניתנים להחזרה, אלא במקרה של פגם.</p>
        <p>להחזרת מוצר, יש ליצור קשר עם שירות הלקוחות.</p>
      </div>
    </div>
  );
}
