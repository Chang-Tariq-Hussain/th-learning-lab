import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { IpAddressingSimulator } from "@/features/subjects/information-technology/ip-addressing-simulator";
import { getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";
import { IpAddressingTopicExperience } from "./topic-experience-client";

const SIMULATION_HREF = "/dashboard/information-technology/ip-addressing-simulator";

export const metadata: Metadata = {
  title: "IP Addressing Simulator",
  description:
    "Learn how IPv4 addresses identify network interfaces: binary and decimal, subnet masks and CIDR, network and host portions, network and broadcast addresses, local vs. remote destinations, and the default gateway.",
};

export default function IpAddressingSimulatorPage() {
  const content = getTopicContent("information-technology", "ip-addressing-simulator");

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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">IP Addressing Simulator</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          The fifth topic in the Networking branch. See how IPv4 addresses identify network interfaces, how a subnet mask splits an address into network and host portions, and how a device decides whether a destination is local or needs a router.
        </p>
      </div>

      {content ? <IpAddressingTopicExperience content={content} /> : <IpAddressingSimulator />}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
