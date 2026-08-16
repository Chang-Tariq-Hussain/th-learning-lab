import { TRANSITION_MS } from "../model";

export interface ParticleDotProps {
  xPercent: number;
  yPercent: number;
  colorClassName: string;
  sizeClassName?: string;
  title?: string;
}

/** One dot, absolutely positioned in percent, transitioning smoothly whenever its coordinates change. */
export function ParticleDot({
  xPercent,
  yPercent,
  colorClassName,
  sizeClassName = "h-3 w-3",
  title,
}: ParticleDotProps) {
  return (
    <span
      title={title}
      className={`absolute rounded-full shadow-sm ${sizeClassName} ${colorClassName}`}
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        transform: "translate(-50%, -50%)",
        transition: `left ${TRANSITION_MS}ms ease-in-out, top ${TRANSITION_MS}ms ease-in-out`,
      }}
    />
  );
}
