export const SITE_OWNER_EMAIL = "imontaser6@gmail.com";

export function hasAdminAccess(user: { email?: string | null; role?: string } | null) {
  if (!user) return false;
  return user.role === "admin" || user.email?.toLowerCase() === SITE_OWNER_EMAIL;
}
