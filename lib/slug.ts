const NAME_MAP: Record<string, string> = {
  سيف: "seif",
  سما: "sama",
  محمد: "mohamed",
  أحمد: "ahmed",
  محمود: "mahmoud",
  علي: "ali",
  عمر: "omar",
  يوسف: "youssef",
  فاطمة: "fatma",
  نور: "nour",
  مريم: "mariam",
  سارة: "sara",
  آية: "aya",
};

const ARABIC_MAP: Record<string, string> = {
  ا: "a",
  أ: "a",
  إ: "e",
  آ: "a",
  ء: "",
  ب: "b",
  ت: "t",
  ث: "th",
  ج: "g",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "z",
  ر: "r",
  ز: "z",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "d",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "q",
  ك: "k",
  ل: "l",
  م: "m",
  ن: "n",
  ه: "h",
  و: "w",
  ي: "y",
  ى: "y",
  ة: "a",
  ئ: "y",
  ؤ: "w",
  " ": "-",
};

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function transliterate(input: string) {
  return input
    .trim()
    .split("")
    .map((char) => ARABIC_MAP[char] ?? char)
    .join("");
}

export function slugify(input: string) {
  const named = NAME_MAP[input.trim()] ?? transliterate(input);
  return named
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function buildCoupleSlug(groomName: string, brideName: string) {
  const left = slugify(groomName) || "groom";
  const right = slugify(brideName) || "bride";
  return `${left}-${right}`.slice(0, 60);
}

export function isValidSlug(slug: string) {
  return slug.length >= 3 && slug.length <= 60 && SLUG_PATTERN.test(slug);
}

export function nextSlugCandidate(base: string, attempt: number) {
  if (attempt === 0) return base;
  const suffix = attempt === 1 ? "2" : Math.random().toString(36).slice(2, 5);
  return `${base}-${suffix}`.slice(0, 60);
}
