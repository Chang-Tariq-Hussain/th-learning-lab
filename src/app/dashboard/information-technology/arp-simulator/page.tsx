import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { ArpSimulator } from "@/features/subjects/information-technology/arp-simulator";
import { getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";
import { ArpTopicExperience } from "./topic-experience-client";

const SIMULATION_HREF = "/dashboard/information-technology/arp-simulator";

export const metadata: Metadata = {
  title: "ARP Simulator",
  description:
    "Learn how a device finds the MAC address that goes with an IPv4 address on its local network: ARP requests and replies, broadcast, the ARP cache, cache hits and misses, and the default gateway.",
};

export default function ArpSimulatorPage() {
  const content = getTopicContent("information-technology", "arp-simulator");

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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">ARP Simulator</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          The seventh topic in the Networking branch. See how a device turns an IPv4 address into a MAC address with ARP before it sends an Ethernet frame: request, reply, cache, and the default gateway.
        </p>
      </div>

      {content ? <ArpTopicExperience content={content} /> : <ArpSimulator />}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
