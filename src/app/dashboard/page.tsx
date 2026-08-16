import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
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
    <div className="lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-16">
          <Sidebar className="h-[calc(100vh-4rem)]" />
        </div>
      </aside>

      <div className="min-w-0">
        <Container className="py-14">
          <WelcomeHeading />

          <RulerDivider className="my-10" />

          <SubjectGrid />
        </Container>
      </div>
    </div>
  );
}
