/**
 * What each admin role may do in the web app. This only decides what the UI
 * offers and which pages render; the database enforces the same rules with
 * row-level security (supabase/migrations/…_security.sql), which is the real boundary.
 */
export type AdminRole = "super_admin" | "content_manager" | "question_manager" | "analyst";
export const ADMIN_ROLES: AdminRole[] = ["super_admin", "content_manager", "question_manager", "analyst"];

export const ROLE_LABEL: Record<AdminRole, string> = {
  super_admin: "Super admin",
  content_manager: "Content manager",
  question_manager: "Question manager",
  analyst: "Analyst",
};

export const ROLE_SUMMARY: Record<AdminRole, string> = {
  super_admin: "Everything, including admin users and the audit log.",
  content_manager: "Reads everything; edits subjects, simulations, learning experiences, paths, connections and media.",
  question_manager: "Reads everything; edits question banks, questions and exams.",
  analyst: "Read-only access.",
};

export type Permission = "overview.view" | "health.view" | "audit.view" | "admins.manage" | "questions.view" | "questions.edit" | "content.publish";

const MATRIX: Record<AdminRole, readonly Permission[]> = {
  super_admin: ["overview.view", "health.view", "audit.view", "admins.manage", "questions.view", "questions.edit", "content.publish"],
  content_manager: ["overview.view", "health.view", "questions.view"],
  question_manager: ["overview.view", "health.view", "questions.view", "questions.edit", "content.publish"],
  analyst: ["overview.view", "health.view", "questions.view"],
};

export function can(role: AdminRole, permission: Permission): boolean {
  return MATRIX[role].includes(permission);
}

export function isAdminRole(x: unknown): x is AdminRole {
  return typeof x === "string" && (ADMIN_ROLES as string[]).includes(x);
}

/**
 * Pages restricted to certain permissions. The middleware uses this to answer denied requests with a
 * real HTTP redirect (pages also re-check via requirePermission — that remains authoritative).
 */
export const PATH_PERMISSIONS: readonly { prefix: string; permission: Permission }[] = [
  { prefix: "/admin/audit", permission: "audit.view" },
  { prefix: "/admin/admins", permission: "admins.manage" },
  { prefix: "/admin/questions/new", permission: "questions.edit" },
  { prefix: "/admin/questions/import", permission: "questions.edit" },
];

export function permissionForPath(pathname: string): Permission | null {
  return PATH_PERMISSIONS.find((p) => pathname === p.prefix || pathname.startsWith(`${p.prefix}/`))?.permission ?? null;
}
