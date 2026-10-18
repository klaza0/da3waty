const steps = [
  { n: "01", title: "اختر التصميم", text: "تصفح القوالب واختَر الشكل الأقرب لمناسبتك." },
  { n: "02", title: "اشترك مرة واحدة", text: "١٠٠٠ جنيه على فودافون كاش، ويفتح الموقع بالكامل بدون تجديد." },
  { n: "03", title: "أضف بياناتك", text: "الأسماء، الموعد، المكان، والصور إن أحببت." },
  { n: "04", title: "انشر وشارك دعوتك", text: "احصل على رابط خاص وأرسله عبر واتساب." },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-ivory py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl">أربع خطوات فقط</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article key={step.n} className="rounded-[1.6rem] bg-white p-6 shadow-soft">
              <p className="font-display text-3xl text-gold">{step.n}</p>
              <h3 className="mt-4 text-xl font-medium">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
