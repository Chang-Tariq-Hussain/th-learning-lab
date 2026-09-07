import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { WelcomeHeading } from "@/components/dashboard/welcome-heading";
import { SubjectGrid } from "@/components/dashboard/subject-grid";
import { RulerDivider } from "@/components/ui/ruler-divider";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Browse Physics, Chemistry, Biology, and Mathematics.",
};

export default function DashboardPage() {
  return (
    <Container className="py-14">
      <WelcomeHeading />

      <RulerDivider className="my-10" />

      <SubjectGrid />
    </Container>
  );
}
