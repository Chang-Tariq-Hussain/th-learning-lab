"use client";

import { useEffect, useState } from "react";
import { Play, RotateCcw, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEVICES, hex, levelAtLeast, type DeviceId, type Level } from "../model";
import { Btn, Callout, Panel, SectionHeading, SegmentedChoice } from "./ui-bits";

interface IoExample {
  id: string;
  icon: string;
  label: string;
  kind: "input" | "output";
  flow: string;
  from: string;
  to: string;
  note: string;
}

const EXAMPLES: IoExample[] = [
  { id: "keyboard", icon: "⌨", label: "Keyboard", kind: "input", from: "Keyboard", to: "CPU", flow: "Keyboard → CPU", note: "Key presses travel from the device into the computer." },
  { id: "mouse", icon: "🖱", label: "Mouse", kind: "input", from: "Mouse", to: "CPU", flow: "Mouse → CPU", note: "Movement and clicks are input the computer must react to." },
  { id: "disk", icon: "💾", label: "Disk (read)", kind: "input", from: "Disk", to: "Memory", flow: "Disk → Memory", note: "Reading a file brings data from storage into memory — that direction is input." },
  { id: "display", icon: "🖥", label: "Display", kind: "output", from: "CPU", to: "Display", flow: "CPU → Display", note: "The computer sends pixels out to be shown." },
  { id: "printer", icon: "🖨", label: "Printer", kind: "output", from: "CPU", to: "Printer", flow: "CPU → Printer", note: "A print job is data sent out to the device." },
];

type ReqDevice = Extract<DeviceId, "storage" | "network" | "keyboard">;

const REQ_STATES = [
  { id: "request", label: "Request", detail: "The CPU writes a READ DATA command into the controller's control register.", status: "Command received", statusCode: 0x01, control: "READ DATA", irq: false, buffered: false },
  { id: "processing", label: "Device processing", detail: "The controller drives the physical device. The CPU is not stuck waiting — it can do other work.", status: "Busy", statusCode: 0x02, control: "READ DATA", irq: false, buffered: false },
  { id: "available", label: "Data available", detail: "The data is now in the controller's buffer and the controller signals that it is ready — often with an interrupt request.", status: "Ready", statusCode: 0x04, control: "READ DATA", irq: true, buffered: true },
  { id: "completion", label: "Completion", detail: "The CPU (or an ISR) reads the buffer, the data goes to memory, and the controller returns to idle.", status: "Idle", statusCode: 0x00, control: "—", irq: false, buffered: false },
] as const;

const REQ_DEVICES: { id: ReqDevice; label: string; data: string }[] = [
  { id: "storage", label: "Storage", data: "Block #7 (4 KB)" },
  { id: "network", label: "Network", data: "Packet #3 (64 B)" },
  { id: "keyboard", label: "Keyboard", data: "Key 'A'" },
];

export function BasicsLab({ level }: { level: Level }) {
  const [ex, setEx] = useState<IoExample>(EXAMPLES[0] as IoExample);
  const [dev, setDev] = useState<ReqDevice>("storage");
  const [state, setState] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const technical = levelAtLeast(level, "technical");

  useEffect(() => {
    if (!playing) return;
    if (state >= REQ_STATES.length - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setState((s) => s + 1), 1700);
    return () => clearTimeout(id);
  }, [playing, state]);

  const cur = state >= 0 ? REQ_STATES[state] : null;
  const reqDev = REQ_DEVICES.find((d) => d.id === dev)!;
  const regs = DEVICES[dev].registers;

  return (
    <div className="flex flex-col gap-10">
      {/* What is I/O */}
      <div className="flex flex-col gap-4">
        <SectionHeading title="What is I/O?">
          I/O (input/output) is communication between the computer system and its devices. Input brings data in; output sends data out. Tap a device.
        </SectionHeading>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-card border border-line p-3 dark:border-line-dark">
            <p className="font-medium text-ink dark:text-bone">Input</p>
            <p className="font-mono text-sm text-ink-soft dark:text-bone-soft">Device → Computer</p>
          </div>
          <div className="rounded-card border border-line p-3 dark:border-line-dark">
            <p className="font-medium text-ink dark:text-bone">Output</p>
            <p className="font-mono text-sm text-ink-soft dark:text-bone-soft">Computer → Device</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Example devices">
          {EXAMPLES.map((e) => (
            <Btn key={e.id} pressed={ex.id === e.id} onClick={() => setEx(e)}>
              <span aria-hidden="true">{e.icon}</span> {e.label}
            </Btn>
          ))}
        </div>
        <div className={cn("rounded-card border p-4", ex.kind === "input" ? "border-sky-500/40 bg-sky-500/5" : "border-emerald-500/40 bg-emerald-500/5")} aria-live="polite">
          <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">{ex.kind === "input" ? "Input" : "Output"}</p>
          <p className="mt-1 font-mono text-lg text-ink dark:text-bone">
            {ex.icon} {ex.flow}
          </p>
          <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">{ex.note}</p>
        </div>
      </div>

      {/* Controller + request */}
      <div className="flex flex-col gap-4">
        <SectionHeading title="Device controllers and I/O requests">
          Software usually doesn&apos;t manipulate a physical device directly. It talks to a device controller — hardware with a status, a data buffer, and control
          information — and the controller handles the device. Issue a request and watch the controller change.
        </SectionHeading>

        <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-ink dark:text-bone">
          <span className="rounded-md border border-line px-2.5 py-1.5 dark:border-line-dark">{DEVICES[dev].icon} {DEVICES[dev].label}</span>
          <span aria-hidden="true">↔</span>
          <span className="rounded-md border border-subject-it px-2.5 py-1.5 text-subject-it">{DEVICES[dev].controller}</span>
          <span aria-hidden="true">↔</span>
          <span className="rounded-md border border-line px-2.5 py-1.5 dark:border-line-dark">CPU / Memory</span>
        </div>

        <SegmentedChoice
          label="Device for the request"
          value={dev}
          onChange={(d) => {
            setDev(d);
            setState(-1);
            setPlaying(false);
          }}
          options={REQ_DEVICES.map((d) => ({ id: d.id, label: d.label }))}
        />

        <div className="flex flex-wrap gap-2">
          <Btn
            variant="solid"
            onClick={() => {
              if (state === -1 || state >= REQ_STATES.length - 1) {
                setState(0);
                setPlaying(true);
              } else setPlaying((p) => !p);
            }}
          >
            <Play className="h-4 w-4" aria-hidden="true" /> {state === -1 ? "CPU: READ DATA" : playing ? "Pause" : state >= REQ_STATES.length - 1 ? "Replay" : "Resume"}
          </Btn>
          <Btn onClick={() => { setPlaying(false); setState((s) => Math.min(s + 1, REQ_STATES.length - 1)); }}>
            <StepForward className="h-4 w-4" aria-hidden="true" /> Step
          </Btn>
          <Btn onClick={() => { setPlaying(false); setState(-1); }}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
          </Btn>
        </div>

        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {REQ_STATES.map((s, i) => (
            <li
              key={s.id}
              className={cn(
                "rounded-card border p-2.5 text-center text-sm transition-colors",
                i === state ? "border-subject-it bg-subject-it-soft font-medium text-subject-it dark:bg-subject-it/20" : i < state ? "border-emerald-500/40 text-ink dark:text-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
              )}
            >
              <span className="block font-mono text-[10px] opacity-60">{i + 1}</span>
              {s.label}
            </li>
          ))}
        </ol>
        <p className="min-h-[2.5rem] text-sm text-ink-soft dark:text-bone-soft" aria-live="polite">
          {cur ? cur.detail : "Press “CPU: READ DATA” to begin an I/O request."}
        </p>

        <Panel title={`${DEVICES[dev].controller} — click-through view`}>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-md border border-line p-2 dark:border-line-dark">
              <dt className="text-xs text-ink-soft dark:text-bone-soft">Device status</dt>
              <dd className="font-medium text-ink dark:text-bone">{cur ? cur.status : "Idle"}</dd>
            </div>
            <div className="rounded-md border border-line p-2 dark:border-line-dark">
              <dt className="text-xs text-ink-soft dark:text-bone-soft">Data buffer</dt>
              <dd className="font-mono text-ink dark:text-bone">{cur?.buffered ? reqDev.data : "empty"}</dd>
            </div>
            <div className="rounded-md border border-line p-2 dark:border-line-dark">
              <dt className="text-xs text-ink-soft dark:text-bone-soft">Control information</dt>
              <dd className="text-ink dark:text-bone">{cur ? cur.control : "—"}</dd>
            </div>
            <div className="rounded-md border border-line p-2 dark:border-line-dark">
              <dt className="text-xs text-ink-soft dark:text-bone-soft">Interrupt request</dt>
              <dd className={cn("font-medium", cur?.irq ? "text-amber-700 dark:text-amber-300" : "text-ink dark:text-bone")}>{cur?.irq ? "Asserted (1)" : "Clear (0)"}</dd>
            </div>
          </dl>
          {technical && (
            <p className="mt-2 font-mono text-xs text-ink-soft dark:text-bone-soft">
              {regs.status} = {hex(cur?.statusCode ?? 0, 2)} · {regs.control} = {cur ? "READ" : "NONE"} · {regs.data} = {cur?.buffered ? reqDev.data : "(empty)"}
            </p>
          )}
        </Panel>
        <Callout tone="note">Simplified educational representation of a controller. Real controllers have their own register layouts and behavior.</Callout>
      </div>
    </div>
  );
}
