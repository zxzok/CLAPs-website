"use client";

import { motion } from "framer-motion";
import { BlockMath, InlineMath } from "react-katex";

import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-[28px] border border-white/80 bg-white/88 p-6 shadow-card backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  tone = "default",
  hint
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "layer1" | "layer2";
  hint?: string;
}) {
  const toneClass =
    tone === "layer1"
      ? "from-layer1/15 to-layer1/5"
      : tone === "layer2"
        ? "from-layer2/15 to-layer2/5"
        : "from-ink/10 to-white";

  return (
    <div className={cn("rounded-3xl border border-ink/8 bg-gradient-to-br p-4", toneClass)}>
      <div className="text-xs uppercase tracking-[0.2em] text-ink/55">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-ink">{value}</div>
      {hint ? <div className="mt-1 text-sm text-ink/65">{hint}</div> : null}
    </div>
  );
}

export function EquationCard({
  title,
  formula,
  body
}: {
  title: string;
  formula: string;
  body: string;
}) {
  return (
    <Card className="h-full">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/55">{title}</div>
      <div className="mt-5 overflow-x-auto rounded-2xl bg-mist/80 px-3 py-2 text-ink">
        <BlockMath math={formula} />
      </div>
      <p className="mt-4 text-sm leading-7 text-ink/75">{body}</p>
    </Card>
  );
}

export function FormulaPill({ math }: { math: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-ink/10 bg-white px-4 py-2 text-sm text-ink shadow-sm">
      <InlineMath math={math} />
    </span>
  );
}

export function KeyDot({
  color,
  label
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-ink/70">
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}

export function Stepper({
  current,
  total,
  onNext,
  onPrevious,
  onReset
}: {
  current: number;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onPrevious}
        className="rounded-full border border-ink/10 px-4 py-2 text-sm text-ink transition hover:border-ink/20 hover:bg-ink/5"
      >
        Previous
      </button>
      <button
        type="button"
        onClick={onNext}
        className="rounded-full bg-ink px-4 py-2 text-sm text-white transition hover:bg-ink/90"
      >
        Next
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-ink/10 px-4 py-2 text-sm text-ink transition hover:border-ink/20 hover:bg-ink/5"
      >
        Reset
      </button>
      <div className="ml-auto text-sm text-ink/60">
        Step {current + 1} / {total}
      </div>
    </div>
  );
}

export function SurfaceTitle({
  title,
  body
}: {
  title: string;
  body?: string;
}) {
  return (
    <div className="mb-5">
      <div className="text-lg font-semibold text-ink">{title}</div>
      {body ? <p className="mt-2 text-sm leading-7 text-ink/70">{body}</p> : null}
    </div>
  );
}

export function FadeIn({
  children,
  delay = 0
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
