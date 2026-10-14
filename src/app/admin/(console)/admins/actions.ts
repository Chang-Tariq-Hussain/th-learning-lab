"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/admin/auth";
import { isAdminRole, ROLE_LABEL } from "@/lib/admin/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const clip = (s: string): string => encodeURIComponent(s.slice(0, 200));

/** Grant or change a role. Authorised twice: here, and by the database function (super_admin only, audited). */
export async function setRoleAction(formData: FormData): Promise<void> {
  const session = await requirePermission("admins.manage");
  if (session.mode !== "accounts") redirect("/admin/admins");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) redirect(`/admin/admins?error=${clip("Enter a valid email address.")}`);
  if (!isAdminRole(role)) redirect(`/admin/admins?error=${clip("Choose a role.")}`);

  const { error } = await createSupabaseServerClient().rpc("admin_set_role_by_email", { p_email: email, p_role: role });
  if (error) redirect(`/admin/admins?error=${clip(error.message)}`);
  revalidatePath("/admin/admins");
  redirect(`/admin/admins?ok=${clip(`${email} is now ${ROLE_LABEL[role]}.`)}`);
}

export async function revokeRoleAction(formData: FormData): Promise<void> {
  const session = await requirePermission("admins.manage");
  if (session.mode !== "accounts") redirect("/admin/admins");
  const userId = String(formData.get("user_id") ?? "");
  if (!UUID.test(userId)) redirect(`/admin/admins?error=${clip("Invalid user.")}`);

  const { error } = await createSupabaseServerClient().rpc("admin_revoke_role", { p_user: userId });
  if (error) redirect(`/admin/admins?error=${clip(error.message)}`);
  revalidatePath("/admin/admins");
  redirect(`/admin/admins?ok=${clip("Admin access revoked.")}`);
}
