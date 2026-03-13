"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { primerDrivers, primerEdges, primerMatching, primerNetworkNodes } from "@/data/demoData";
import { cn } from "@/lib/utils";

import { Card, KeyDot, Stepper, SurfaceTitle } from "./ui";

const stages = [
  {
    title: "Directed network",
    body: "Start with a directed layer. Control analysis begins from topology, not from a chosen driver list."
  },
  {
    title: "Bipartite representation",
    body: "Each node is duplicated into a source-side copy and a target-side copy. Every directed edge becomes a bipartite edge."
  },
  {
    title: "Maximum matching",
    body: "A maximum matching covers as many target-side copies as possible without conflict."
  },
  {
    title: "Driver nodes",
    body: "Unmatched target-side copies determine the minimum driver set. Driver nodes are induced by the matching structure."
  }
];

export function StructuralPrimer() {
  const [stage, setStage] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setStage((current) => {
        if (current === stages.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1800);

    return () => window.clearInterval(timer);
  }, [playing]);

  const bipartitePositions = useMemo(
    () =>
      primerNetworkNodes.map((node) => ({
        id: node.id,
        left: { x: 18, y: node.y },
        right: { x: 82, y: node.y }
      })),
    []
  );

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SurfaceTitle
            title="Animation A · Single-layer structural controllability primer"
            body="Hover a node to see how it maps from the original directed graph into the bipartite representation."
          />
          <div className="rounded-[26px] border border-ink/8 bg-gradient-to-br from-white to-mist/70 p-4">
            <svg viewBox="0 0 100 100" className="w-full">
              {stage >= 0 &&
                primerEdges.map(([from, to]) => {
                  const a = primerNetworkNodes.find((node) => node.id === from)!;
                  const b = primerNetworkNodes.find((node) => node.id === to)!;
                  return (
                    <motion.g key={`${from}-${to}`}>
                      <line
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke="#9fb0bb"
                        strokeWidth={1.2}
                        opacity={stage === 0 ? 1 : 0.28}
                      />
                      <polygon
                        points={`${b.x - 1},${b.y - 1} ${b.x + 2},${b.y} ${b.x - 1},${b.y + 1}`}
                        fill="#9fb0bb"
                        opacity={stage === 0 ? 1 : 0.28}
                      />
                    </motion.g>
                  );
                })}

              {stage >= 1 ? (
                <g opacity={0.95}>
                  <rect
                    x="6"
                    y="8"
                    width="88"
                    height="84"
                    rx="10"
                    fill="rgba(255,255,255,0.35)"
                    stroke="rgba(22,33,43,0.08)"
                    strokeDasharray="4 4"
                  />
                  {bipartitePositions.map((node) => (
                    <g key={`guide-${node.id}`}>
                      <line
                        x1={node.left.x}
                        y1={node.left.y}
                        x2={node.right.x}
                        y2={node.right.y}
                        stroke="rgba(22,33,43,0.08)"
                        strokeDasharray="3 4"
                      />
                    </g>
                  ))}
                  {primerEdges.map(([from, to]) => {
                    const a = bipartitePositions.find((node) => node.id === from)!.left;
                    const b = bipartitePositions.find((node) => node.id === to)!.right;
                    const matched = primerMatching.some(([mFrom, mTo]) => mFrom === from && mTo === to);
                    return (
                      <line
                        key={`b-${from}-${to}`}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={stage >= 2 && matched ? "#16212b" : "rgba(11,114,133,0.34)"}
                        strokeWidth={stage >= 2 && matched ? 2.6 : 1.2}
                      />
                    );
                  })}
                </g>
              ) : null}

              {primerNetworkNodes.map((node) => {
                const isDriver = primerDrivers.includes(node.id);
                const active = hoveredNode === node.id;
                return (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={active ? 5.2 : 4.2}
                      fill={stage === 3 && isDriver ? "#c2410c" : "#ffffff"}
                      stroke={active ? "#0b7285" : "#16212b"}
                      strokeWidth={active ? 1.8 : 1.2}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    />
                    <text
                      x={node.x}
                      y={node.y + 0.8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={cn(
                        "fill-ink text-[4px] font-semibold",
                        stage === 3 && isDriver && "fill-white"
                      )}
                    >
                      {node.id}
                    </text>
                  </g>
                );
              })}

              {stage >= 1
                ? bipartitePositions.map((node) => {
                    const isDriver = primerDrivers.includes(node.id);
                    const active = hoveredNode === node.id;
                    return (
                      <g key={`bp-${node.id}`}>
                        <circle
                          cx={node.left.x}
                          cy={node.left.y}
                          r={active ? 4.7 : 3.7}
                          fill="#ffffff"
                          stroke={active ? "#0b7285" : "#16212b"}
                          strokeWidth={active ? 1.6 : 1.1}
                          onMouseEnter={() => setHoveredNode(node.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                        />
                        <circle
                          cx={node.right.x}
                          cy={node.right.y}
                          r={active ? 4.7 : 3.7}
                          fill={stage === 3 && isDriver ? "#fff4ed" : "#ffffff"}
                          stroke={
                            stage === 3 && isDriver ? "#c2410c" : active ? "#0b7285" : "#16212b"
                          }
                          strokeWidth={stage === 3 && isDriver ? 2 : active ? 1.6 : 1.1}
                          onMouseEnter={() => setHoveredNode(node.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                        />
                        <text
                          x={node.left.x}
                          y={node.left.y + 0.6}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-ink text-[3.8px] font-semibold"
                        >
                          {node.id}+
                        </text>
                        <text
                          x={node.right.x}
                          y={node.right.y + 0.6}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={cn(
                            "fill-ink text-[3.8px] font-semibold",
                            stage === 3 && isDriver && "fill-driver"
                          )}
                        >
                          {node.id}-
                        </text>
                      </g>
                    );
                  })
                : null}

              {stage >= 1 ? (
                <>
                  <text x="12" y="9" className="fill-ink/60 text-[3.4px] uppercase tracking-[0.2em]">
                    source copies
                  </text>
                  <text x="73" y="9" className="fill-ink/60 text-[3.4px] uppercase tracking-[0.2em]">
                    target copies
                  </text>
                </>
              ) : null}
            </svg>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-[26px] border border-ink/8 bg-white/90 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/55">
              Current frame
            </div>
            <div className="mt-3 text-2xl font-semibold text-ink">{stages[stage].title}</div>
            <p className="mt-3 text-sm leading-7 text-ink/72">{stages[stage].body}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <KeyDot color="#16212b" label="Matched edge" />
              <KeyDot color="#9fb0bb" label="Non-matching edge" />
              <KeyDot color="#c2410c" label="Driver node" />
            </div>
          </div>
          <div className="rounded-[26px] border border-ink/8 bg-mist/65 p-5 text-sm leading-7 text-ink/75">
            <p>
              Hovered node:{" "}
              <span className="font-semibold text-ink">{hoveredNode ? `Node ${hoveredNode}` : "None"}</span>
            </p>
            <p className="mt-3">
              Driver nodes are not chosen by hand. They are induced by whichever target-side copies
              remain unmatched in a maximum matching.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPlaying((current) => !current)}
              className="rounded-full border border-ink/10 px-4 py-2 text-sm text-ink transition hover:bg-ink/5"
            >
              {playing ? "Pause" : "Play"}
            </button>
            <Stepper
              current={stage}
              total={stages.length}
              onNext={() => setStage((current) => Math.min(current + 1, stages.length - 1))}
              onPrevious={() => setStage((current) => Math.max(current - 1, 0))}
              onReset={() => {
                setPlaying(false);
                setStage(0);
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
