import { titleColorHex } from "@/lib/design-studio";
import type { InvitationData } from "@/types/invitation";

export function ThemeFrame({ data, children }: { data: InvitationData; children: React.ReactNode }) {
  const language = data.language ?? "ar";
  const rtl = language !== "en";
  return (
    <div
      lang={language}
      dir={rtl ? "rtl" : "ltr"}
      data-name-font={data.nameFont ?? "amiri"}
      data-calligraphy={data.calligraphyEnabled === false ? "off" : "on"}
      style={
        {
          "--invite-name-color": data.nameColor || "#a48642",
          "--invite-title-color": titleColorHex(data.titleColor),
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
