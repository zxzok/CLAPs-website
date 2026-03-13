"use client";

import { useState } from "react";

import { bfsFrames, toyNodePositions } from "@/data/demoData";

import { Card, KeyDot, Stepper, SurfaceTitle } from "./ui";

export function ShortestClapSearch() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [mode, setMode] = useState<"intuition" | "technical">("intuition");
  const frame = bfsFrames[frameIndex];

  const statusForNode = (nodeId: number) => {
    if (frame.target === nodeId) return { label: "target", color: "#d97706" };
    if (frame.frontier.some((item) => item.node === nodeId)) return { label: "frontier", color: "#0b7285" };
    if (frame.relays.includes(nodeId)) return { label: "relay", color: "#365486" };
    if (frame.visited.some((item) => item.node === nodeId)) return { label: "visited", color: "#94a3b8" };
    return { label: "unseen", color: "#d9e0e6" };
  };

  return (
    <Card>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <SurfaceTitle
            title="Animation D · Shortest CLAP search"
            body="This view turns the layer-alternating BFS into a visual search process. Switch between intuition mode and technical mode."
          />
          <div className="flex gap-3">
            {[
              ["intuition", "Intuition mode"],
              ["technical", "Technical mode"]
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value as "intuition" | "technical")}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  mode === value
                    ? "bg-ink text-white"
                    : "border border-ink/10 bg-white text-ink hover:bg-ink/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="rounded-[26px] border border-ink/8 bg-gradient-to-br from-white to-mist/70 p-5">
            <svg viewBox="0 0 100 100" className="w-full">
              {toyNodePositions.map((node) => {
                const status = statusForNode(node.id);
                return (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={status.label === "frontier" || status.label === "target" ? 5.5 : 4.3}
                      fill={`${status.color}1a`}
                      stroke={status.color}
                      strokeWidth={status.label === "target" ? 2.4 : 1.5}
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
          <div className="flex flex-wrap gap-4 text-sm">
            <KeyDot color="#0b7285" label="Frontier" />
            <KeyDot color="#365486" label="Relay" />
            <KeyDot color="#d97706" label="Target in DD2" />
            <KeyDot color="#94a3b8" label="Visited state" />
          </div>
          <Stepper
            current={frameIndex}
            total={bfsFrames.length}
            onNext={() => setFrameIndex((current) => Math.min(current + 1, bfsFrames.length - 1))}
            onPrevious={() => setFrameIndex((current) => Math.max(current - 1, 0))}
            onReset={() => setFrameIndex(0)}
          />
        </div>
        <div className="space-y-5">
          <div className="rounded-[24px] border border-ink/8 bg-white/90 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
              This frame explains
            </div>
            <div className="mt-3 text-xl font-semibold text-ink">{frame.modeLabel}</div>
            <p className="mt-3 text-sm leading-7 text-ink/74">{frame.note}</p>
            <div className="mt-4 inline-flex rounded-full bg-layer1/12 px-4 py-2 text-sm font-medium text-layer1">
              Shortest path support keeps the update local and atomic.
            </div>
          </div>
          {mode === "technical" ? (
            <div className="rounded-[24px] border border-ink/8 bg-gradient-to-br from-white to-mist/75 p-5">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                Technical state
              </div>
              <div className="space-y-3 text-sm text-ink/75">
                <div>
                  <span className="font-medium text-ink">Queue:</span> {frame.queue.join(" -> ") || "empty"}
                </div>
                <div>
                  <span className="font-medium text-ink">Frontier:</span>{" "}
                  {frame.frontier.map((item) => `${item.node}(next L${item.layer})`).join(", ")}
                </div>
                <div>
                  <span className="font-medium text-ink">Visited states:</span>{" "}
                  {frame.visited.map((item) => `${item.node}/L${item.layer}`).join(", ")}
                </div>
                <div>
                  <span className="font-medium text-ink">Relays accepted:</span>{" "}
                  {frame.relays.join(", ") || "none"}
                </div>
                <div>
                  <span className="font-medium text-ink">Target reached:</span>{" "}
                  {frame.target ? `node ${frame.target}` : "not yet"}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[24px] border border-ink/8 bg-mist/65 p-5 text-sm leading-7 text-ink/74">
              Intuition mode hides queue and predecessor bookkeeping. Read the search as a layered
              expansion: start from DD1, alternate layer roles, accept only relay nodes that remain
              consistent, and stop as soon as DD2 is reached.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
