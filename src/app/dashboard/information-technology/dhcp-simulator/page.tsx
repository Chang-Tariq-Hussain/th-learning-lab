import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { DhcpSimulator } from "@/features/subjects/information-technology/dhcp-simulator";
import { getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";
import { DhcpTopicExperience } from "./topic-experience-client";

const SIMULATION_HREF = "/dashboard/information-technology/dhcp-simulator";

export const metadata: Metadata = {
  title: "DHCP Simulator",
  description:
    "Learn how a device gets its network configuration automatically: the DORA process (Discover, Offer, Request, ACK), address pools, leases, renewal and release, pool exhaustion, and static versus DHCP configuration.",
};

export default function DhcpSimulatorPage() {
  const content = getTopicContent("information-technology", "dhcp-simulator");

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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">DHCP Simulator</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          The eighth topic in the Networking branch. See how a device with no address gets its whole network configuration automatically: the DORA process, address pools, leases, and what happens when the pool runs out.
        </p>
      </div>

      {content ? <DhcpTopicExperience content={content} /> : <DhcpSimulator />}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
