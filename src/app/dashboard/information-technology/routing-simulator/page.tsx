import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { RoutingSimulator } from "@/features/subjects/information-technology/routing-simulator";

const SIMULATION_HREF = "/dashboard/information-technology/routing-simulator";

export const metadata: Metadata = {
  title: "Routing Simulator",
  description:
    "See how a router forwards packets between networks: the default gateway, routing tables, connected and static routes, the default route, the most specific matching route, and what happens when no route exists.",
};

export default function RoutingSimulatorPage() {
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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Routing Simulator</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Follow a packet from one network to another. Watch a host decide to use its default gateway, then watch each router look up the destination IP address in its routing table, choose the best matching route and forward the packet, or drop it when no route exists.
        </p>
      </div>

      <RoutingSimulator />
    </Container>
  );
}
