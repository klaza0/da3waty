import {
  CalendarClock,
  HeartHandshake,
  ImageIcon,
  Link2,
  MapPinned,
  MessageCircleHeart,
  Music2,
  QrCode,
  Share2,
  Sparkles,
} from "lucide-react";

const features = [
  { icon: Sparkles, title: "تصميمات جاهزة", text: "قوالب أنيقة جاهزة للتخصيص فورًا." },
  { icon: Link2, title: "رابط خاص لدعوتك", text: "رابط قصير وواضح يسهل مشاركته." },
  { icon: CalendarClock, title: "العد التنازلي", text: "عدّاد حتى موعد المناسبة." },
  { icon: MapPinned, title: "خرائط جوجل", text: "زر يفتح موقع الحفل مباشرة." },
  { icon: HeartHandshake, title: "تأكيد الحضور", text: "اعرف من سيأتي بسهولة." },
  { icon: ImageIcon, title: "صور العروسين", text: "غلاف ومعرض صور اختياري." },
  { icon: Music2, title: "موسيقى", text: "مقطع صوتي بتشغيل اختياري." },
  { icon: MessageCircleHeart, title: "رسائل وتهاني", text: "سجل ضيوف يكتبون كلمات المحبة." },
  { icon: QrCode, title: "رمز QR", text: "للطباعة أو المشاركة السريعة." },
  { icon: Share2, title: "مشاركة واتساب", text: "رسالة جاهزة بضغطة واحدة." },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-display text-3xl">كل ما تحتاجه دعوتك</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-3xl border border-line bg-white p-5">
            <feature.icon className="h-5 w-5 text-rose" />
            <h3 className="mt-4 font-medium">{feature.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
