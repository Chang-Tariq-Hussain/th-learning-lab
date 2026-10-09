import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { AuditView } from "@/features/teacher-tests/components/audit-view";
import { TEACHER_BASE } from "@/features/teacher-tests/config";

export const metadata: Metadata = { title: "Teacher Bank Audit", robots: { index: false } };

export default function AuditPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Mock Tests", href: "/dashboard/mock-tests" }, { label: "Sindh Teacher Tests", href: TEACHER_BASE }, { label: "Audit" }]} className="mb-6" />
      <h1 className="mb-6 font-display text-3xl font-medium text-ink dark:text-bone">Question bank audit</h1>
      <AuditView />
    </Container>
  );
}
