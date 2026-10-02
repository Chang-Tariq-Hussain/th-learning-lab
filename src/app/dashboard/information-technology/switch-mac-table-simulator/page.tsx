import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SwitchMacTableSimulator } from "@/features/subjects/information-technology/switch-mac-table-simulator";

const SIMULATION_HREF = "/dashboard/information-technology/switch-mac-table-simulator";

export const metadata: Metadata = {
  title: "Switch & MAC Address Table Simulator",
  description:
    "See how an Ethernet switch works at Layer 2: learning source MAC addresses, the MAC address table and aging, known unicast forwarding, unknown unicast and broadcast flooding, frame by frame.",
};

export default function SwitchMacTableSimulatorPage() {
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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Switch &amp; MAC Address Table Simulator</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Look inside an Ethernet switch. Send frames between PCs and watch the switch learn MAC addresses, build its MAC address table, forward to a single port, flood unknown destinations and broadcasts, and forget entries as they age out.
        </p>
      </div>

      <SwitchMacTableSimulator />
    </Container>
  );
}
