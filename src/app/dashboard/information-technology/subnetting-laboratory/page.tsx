import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SubnettingLaboratory } from "@/features/subjects/information-technology/subnetting-laboratory";
import { getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";
import { SubnettingTopicExperience } from "./topic-experience-client";

const SIMULATION_HREF = "/dashboard/information-technology/subnetting-laboratory";

export const metadata: Metadata = {
  title: "Subnetting Laboratory",
  description:
    "Learn how to divide an IPv4 network into equal-size subnets: CIDR prefixes, borrowed host bits, subnet masks, the number of subnets and hosts, network and broadcast addresses, host ranges, and which subnet an address belongs to.",
};

export default function SubnettingLaboratoryPage() {
  const content = getTopicContent("information-technology", "subnetting-laboratory");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Information Technology", href: "/dashboard/information-technology" },
          { label: "Networking Fundamentals", href: "/dashboard/information-technology/networking-fundamentals" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-it">Information Technology · Networking Fundamentals</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Subnetting Laboratory</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          The sixth topic in the Networking branch. See how borrowing host bits divides one IPv4 network into equal-size subnets, and work out prefixes, masks, subnet counts, host capacity, network addresses, broadcast addresses, and host ranges.
        </p>
      </div>

      {content ? <SubnettingTopicExperience content={content} /> : <SubnettingLaboratory />}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
