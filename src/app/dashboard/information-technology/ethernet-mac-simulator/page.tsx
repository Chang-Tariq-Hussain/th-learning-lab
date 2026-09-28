import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { EthernetMacSimulator } from "@/features/subjects/information-technology/ethernet-mac-simulator";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/ethernet-mac-simulator";

export const metadata: Metadata = {
  title: "Ethernet & MAC Address Simulator",
  description:
    "Explore how devices communicate on a local Ethernet network: MAC addresses, the simplified Ethernet frame, unicast and broadcast delivery, and how a switch learns MAC addresses and forwards frames.",
};

export default function EthernetMacSimulatorPage() {
  const content = getTopicContent("information-technology", "ethernet-mac-simulator");

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
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-it">
          Information Technology · Networking Fundamentals
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Ethernet &amp; MAC Address Simulator
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          The fourth topic in the Networking branch. Zoom in on one local network: see how devices are identified by
          MAC addresses, how data is wrapped in Ethernet frames, and how a switch learns where devices are and
          delivers each frame.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<EthernetMacSimulator />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <EthernetMacSimulator />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
