import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { MptMockTest } from "@/features/mpt-mock";

export const metadata: Metadata = {
  title: "CSS MPT Mock Test",
  description:
    "Full-length CSS MPT mock: 200 questions in 200 minutes (Islamic Studies 20, Urdu 20, English 50, General Abilities 60, GK/Current Affairs/Pakistan Affairs 50), passing 66/200, with review and section analysis.",
};

export default function MptMockPage() {
  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[{ label: "Dashboard", href: "/dashboard" }]}
        className="mb-4"
      />
      <MptMockTest />
    </Container>
  );
}
