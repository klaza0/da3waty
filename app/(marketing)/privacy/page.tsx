import { APP_NAME, APP_NAME_EN } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: `كيف يجمع ${APP_NAME} بياناتك ويحميها، بما في ذلك ملفات تعريف الارتباط.`,
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 leading-8">
      <p className="text-sm text-gold-deep">
        {APP_NAME} | {APP_NAME_EN}
      </p>
      <h1 className="mt-2 font-display text-4xl">سياسة الخصوصية</h1>
      <p className="mt-3 text-sm text-muted">آخر تحديث: ١٠ أكتوبر ٢٠٢٦</p>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-2xl">مقدمة</h2>
        <p>
          نحن في {APP_NAME} ({APP_NAME_EN}) نحترم خصوصيتك. الصفحة دي بتوضح البيانات اللي بنجمعها، ليه بنستخدمها، وإزاي
          تقدر تتحكم في ملفات تعريف الارتباط (الكوكيز) على الموقع.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-2xl">البيانات اللي بنجمعها</h2>
        <ul className="list-disc space-y-2 pr-6">
          <li>بيانات الحساب: الاسم والبريد الإلكتروني عند التسجيل.</li>
          <li>بيانات الدعوة: أسماء الطرفين، التاريخ، المكان، النصوص، الصور، والموسيقى اللي بترفعها.</li>
          <li>ردود الضيوف: تأكيد الحضور ورسائل التهنئة على الدعوة المنشورة.</li>
          <li>بيانات تقنية أساسية لتشغيل الموقع بأمان (مثل جلسة الدخول).</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-2xl">ملفات تعريف الارتباط</h2>
        <p>
          بنستخدم كوكيز ضرورية عشان تسجيل الدخول وحماية الجلسة. دي لازمة لشغل الموقع ومش بنطلب موافقة منفصلة عليها.
        </p>
        <p>
          بنستخدم كوكيز إحصائية اختيارية لتحليل حركة المرور وتحسين تجربتك على {APP_NAME_EN}. أول ما تفتح الموقع بنسألك
          تقبل أو ترفض الكوكيز الإحصائية. لو رفضت، مش بنفعّل أدوات التحليل دي على جهازك.
        </p>
        <p>تقدر تغيّر اختيارك لاحقًا بمسح بيانات الموقع من المتصفح، وهيظهر البوب أب تاني.</p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-2xl">ليه بنستخدم البيانات</h2>
        <ul className="list-disc space-y-2 pr-6">
          <li>إنشاء حسابك وحفظ دعواتك.</li>
          <li>مشاركة رابط الدعوة مع ضيوفك حسب اختيارك.</li>
          <li>تحسين الخدمة وأمان المنصة.</li>
        </ul>
        <p>مش بنبيع بياناتك لطرف تالت، ومش بنستخدم محتوى دعوتك في إعلانات.</p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-2xl">حقوقك</h2>
        <p>
          تقدر تعدّل دعواتك أو تحذفها من لوحة التحكم، وتقدر تطلب حذف الحساب بالتوصل معانا. لو الدعوة خاصة، الضيوف
          مبيوصلوش للمحتوى من غير كود الدخول.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-2xl">التواصل</h2>
        <p>
          لأي سؤال عن الخصوصية، راسلونا من خلال حسابكم على {APP_NAME}. استمرار استخدام الموقع بعد التحديث يعني إنكم
          اطلعتم على السياسة دي.
        </p>
      </section>
    </article>
  );
}
