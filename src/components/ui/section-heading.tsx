import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-pine-600 dark:text-pine-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance font-display text-3xl font-medium leading-tight text-ink dark:text-bone sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-balance text-base leading-relaxed text-ink-soft dark:text-bone-soft sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
