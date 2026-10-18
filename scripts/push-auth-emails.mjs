import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ref = "ggzbhvashqdxcyywoaxx";
const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!token) {
  console.error("Missing SUPABASE_ACCESS_TOKEN");
  process.exit(1);
}

const confirmation = await readFile(join(root, "supabase/templates/confirmation.html"), "utf8");
const magicLink = await readFile(join(root, "supabase/templates/magic_link.html"), "utf8");
const recovery = await readFile(join(root, "supabase/templates/recovery.html"), "utf8");
const emailChange = await readFile(join(root, "supabase/templates/email_change.html"), "utf8");

const body = {
  mailer_subjects_confirmation: "أكد بريدك في دعوتي",
  mailer_templates_confirmation_content: confirmation,
  mailer_subjects_magic_link: "رابط الدخول إلى دعوتي",
  mailer_templates_magic_link_content: magicLink,
  mailer_subjects_recovery: "إعادة تعيين كلمة المرور — دعوتي",
  mailer_templates_recovery_content: recovery,
  mailer_subjects_email_change: "أكد بريدك الجديد في دعوتي",
  mailer_templates_email_change_content: emailChange,
  mailer_subjects_invite: "دعوة للانضمام إلى دعوتي",
  mailer_templates_invite_content: confirmation,
  site_url: "http://localhost:3000",
  uri_allow_list: "http://localhost:3000/**,http://localhost:3000/auth/callback",
};

const response = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

if (!response.ok) {
  console.error(response.status, await response.text());
  process.exit(1);
}

console.log("Auth email templates updated");
