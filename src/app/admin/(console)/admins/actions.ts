"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/admin/auth";
import { friendlyError } from "@/lib/admin/errors";
import { flashRedirect, guardAction } from "@/lib/admin/flash";
import { isAdminRole, ROLE_LABEL } from "@/lib/admin/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HERE = "/admin/admins";

/** Grant or change a role. Authorised twice: here, and by the database function (super_admin only, audited). */
export async function setRoleAction(formData: FormData): Promise<void> {
  await guardAction(HERE, async () => {
    const session = await requirePermission("admins.manage");
    if (session.mode !== "accounts") redirect(HERE);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const role = String(formData.get("role") ?? "");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) flashRedirect(HERE, "error", "Enter a valid email address.", 200);
    if (!isAdminRole(role)) flashRedirect(HERE, "error", "Choose a role.", 200);

    const { error } = await createSupabaseServerClient().rpc("admin_set_role_by_email", { p_email: email, p_role: role });
    if (error) flashRedirect(HERE, "error", friendlyError(error), 200);
    revalidatePath(HERE);
    flashRedirect(HERE, "ok", `Role updated successfully: ${email} is now ${ROLE_LABEL[role as keyof typeof ROLE_LABEL]}.`, 200);
  });
}

export async function revokeRoleAction(formData: FormData): Promise<void> {
  await guardAction(HERE, async () => {
    const session = await requirePermission("admins.manage");
    if (session.mode !== "accounts") redirect(HERE);
    const userId = String(formData.get("user_id") ?? "");
    if (!UUID.test(userId)) flashRedirect(HERE, "error", "Invalid user.", 200);

    const { error } = await createSupabaseServerClient().rpc("admin_revoke_role", { p_user: userId });
    if (error) flashRedirect(HERE, "error", friendlyError(error), 200);
    revalidatePath(HERE);
    flashRedirect(HERE, "ok", "Admin access revoked.", 200);
  });
}
