"use client";

import { useMemo, useState } from "react";

import { toyBaseEdges, toyNodePositions, traceSteps } from "@/data/demoData";

import { Card, KeyDot, StatCard, Stepper, SurfaceTitle } from "./ui";

function partitionColor(step: (typeof traceSteps)[number], node: number) {
  if (step.dd1.includes(node)) return "#14746f";
  if (step.dd2.includes(node)) return "#d97706";
  if (step.cds.includes(node)) return "#2f6f4f";
  return "#94a3b8";
}

function activeNodeType(step: (typeof traceSteps)[number], node: number) {
  if (!step.activePath.length) return null;
  if (step.activePath[0].nodes[0] === node) return "source";
  if (step.activePath[step.activePath.length - 1].nodes.at(-1) === node) return "target";
  if (step.activePath.some((segment) => segment.nodes.includes(node))) return "relay";
  return null;
}

export function ClapTraceDemo() {
  const [index, setIndex] = useState(0);
  const step = traceSteps[index];

  const unionSize = new Set([...step.d1, ...step.d2]).size;
  const deltaChange = index === 0 ? null : traceSteps[index - 1].delta - step.delta;

  const activeSegments = useMemo(
    () =>
      step.activePath.flatMap((segment) =>
        segment.nodes.slice(0, -1).map((node, i) => ({
          layer: segment.layer,
          from: node,
          to: segment.nodes[i + 1]
        }))
      ),
    [step]
  );

  return (
    <Card>
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SurfaceTitle
            title="Animation C · CLAP execution trace on the paper's toy duplex"
            body="Step through the three shortest CLAPs reported in the case study and watch DD1, DD2, CDS, and CMS evolve."
          />
          <div className="grid gap-5 xl:grid-cols-2">
            {[1, 2].map((layer) => (
              <div
                key={layer}
                className="rounded-[24px] border border-ink/8 bg-gradient-to-br from-white to-mist/75 p-4"
              >
                <div className="mb-3 text-sm font-medium text-ink">Layer {layer}</div>
                <svg viewBox="0 0 100 100" className="w-full">
                  {(toyBaseEdges[layer as 1 | 2] as readonly (readonly [number, number])[]).map(
                    ([from, to]) => {
                      const a = toyNodePositions.find((node) => node.id === from)!;
                      const b = toyNodePositions.find((node) => node.id === to)!;
                      const active = activeSegments.some(
                        (segment) =>
                          segment.layer === layer &&
                          ((segment.from === from && segment.to === to) ||
                            (segment.from === to && segment.to === from))
                      );

                      return (
                        <line
                          key={`${layer}-${from}-${to}`}
                          x1={a.x}
                          y1={a.y}
                          x2={b.x}
                          y2={b.y}
                          stroke={active ? (layer === 1 ? "#0b7285" : "#c7771a") : "#c8d4db"}
                          strokeWidth={active ? 3 : 1.6}
                          strokeLinecap="round"
                        />
                      );
                    }
                  )}

                  {toyNodePositions.map((node) => {
                    const role = activeNodeType(step, node.id);
                    const color = partitionColor(step, node.id);
                    return (
                      <g key={`${layer}-node-${node.id}`}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={role ? 5.2 : 4.2}
                          fill={`${color}18`}
                          stroke={role ? (role === "source" ? "#0f766e" : role === "target" ? "#d97706" : "#365486") : color}
                          strokeWidth={role ? 2.2 : 1.3}
                        />
                        <text
                          x={node.x}
                          y={node.y + 0.6}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-ink text-[4px] font-semibold"
                        >
                          {node.id}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <KeyDot color="#14746f" label="DD1" />
            <KeyDot color="#d97706" label="DD2" />
            <KeyDot color="#2f6f4f" label="CDS" />
            <KeyDot color="#94a3b8" label="CMS" />
            <KeyDot color="#365486" label="Relay on active CLAP" />
          </div>
          <div className="mt-6">
            <Stepper
              current={index}
              total={traceSteps.length}
              onNext={() => setIndex((current) => Math.min(current + 1, traceSteps.length - 1))}
              onPrevious={() => setIndex((current) => Math.max(current - 1, 0))}
              onReset={() => setIndex(0)}
            />
          </div>
        </div>
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Delta" value={step.delta} hint="Difference mass" />
            <StatCard label="|U|" value={unionSize} hint="Union driver set size" />
            <StatCard label="DD1" value={step.dd1.length} tone="layer1" />
            <StatCard label="DD2" value={step.dd2.length} tone="layer2" />
          </div>
          <div className="rounded-[24px] border border-ink/8 bg-white/90 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
              This frame explains
            </div>
            <p className="mt-3 text-sm leading-7 text-ink/74">{step.note}</p>
            {deltaChange ? (
              <div className="mt-4 inline-flex rounded-full bg-layer1/12 px-4 py-2 text-sm font-medium text-layer1">
                Delta decreases by {deltaChange}, |U| decreases by 1
              </div>
            ) : null}
          </div>
          <div className="rounded-[24px] border border-ink/8 bg-gradient-to-br from-white to-mist/70 p-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
              Current sets
            </div>
            <div className="space-y-2 text-sm text-ink/76">
              <div>
                <span className="font-medium text-ink">D1:</span> {step.d1.join(", ")}
              </div>
              <div>
                <span className="font-medium text-ink">D2:</span> {step.d2.join(", ")}
              </div>
              <div>
                <span className="font-medium text-ink">DD1:</span>{" "}
                {step.dd1.length ? step.dd1.join(", ") : "empty"}
              </div>
              <div>
                <span className="font-medium text-ink">DD2:</span>{" "}
                {step.dd2.length ? step.dd2.join(", ") : "empty"}
              </div>
              <div>
                <span className="font-medium text-ink">CDS:</span>{" "}
                {step.cds.length ? step.cds.join(", ") : "empty"}
              </div>
              <div>
                <span className="font-medium text-ink">CMS:</span>{" "}
                {step.cms.length ? step.cms.join(", ") : "empty"}
              </div>
            </div>
          </div>
          <div className="rounded-[24px] border border-ink/8 bg-mist/65 p-5 text-sm leading-7 text-ink/72">
            Relay rule in view: nodes reached by a layer-1 segment must be in CMS before the next
            layer-2 move, while nodes reached by a layer-2 segment must be in CDS before the next
            layer-1 move.
          </div>
        </div>
      </div>
    </Card>
  );
}
