import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { siteConfig } from "@/config/site";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: { default: `Admin | ${siteConfig.name}`, template: `%s | ${siteConfig.name}` }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminConsoleLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin();
  return <AdminShell session={session}>{children}</AdminShell>;
}
