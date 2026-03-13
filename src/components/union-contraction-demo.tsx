"use client";

import { useMemo, useState } from "react";

import { unionContractionStates } from "@/data/demoData";

import { Card, KeyDot, StatCard, SurfaceTitle } from "./ui";

const universe = [1, 2, 3, 4, 5];

function difference(d1: number[], d2: number[]) {
  return d1.filter((node) => !d2.includes(node)).length + d2.filter((node) => !d1.includes(node)).length;
}

export function UnionContractionDemo() {
  const [index, setIndex] = useState(0);
  const state = unionContractionStates[index];

  const partition = useMemo(() => {
    return universe.map((node) => {
      const inL1 = state.d1.includes(node);
      const inL2 = state.d2.includes(node);
      if (inL1 && inL2) return { node, label: "CDS", color: "#2f6f4f" };
      if (inL1) return { node, label: "DD1", color: "#14746f" };
      if (inL2) return { node, label: "DD2", color: "#d97706" };
      return { node, label: "CMS", color: "#94a3b8" };
    });
  }, [state]);

  const unionSize = new Set([...state.d1, ...state.d2]).size;
  const delta = difference(state.d1, state.d2);

  return (
    <Card>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <SurfaceTitle
            title="Animation B · Union contraction in duplex networks"
            body="The budgets |D1| and |D2| stay fixed. What changes is which nodes play the driver role and how much the two layers overlap."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="|D1|" value={state.d1.length} tone="layer1" hint="Layer 1 budget stays fixed" />
            <StatCard label="|D2|" value={state.d2.length} tone="layer2" hint="Layer 2 budget stays fixed" />
            <StatCard label="|U|" value={unionSize} hint="Unique actuated nodes" />
            <StatCard label="Delta" value={delta} hint="Difference mass" />
          </div>
          <p className="text-sm leading-7 text-ink/72">{state.explanation}</p>
          <div className="flex gap-3">
            {unionContractionStates.map((item, itemIndex) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setIndex(itemIndex)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  itemIndex === index
                    ? "bg-ink text-white"
                    : "border border-ink/10 bg-white text-ink hover:bg-ink/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <KeyDot color="#14746f" label="DD1" />
            <KeyDot color="#d97706" label="DD2" />
            <KeyDot color="#2f6f4f" label="CDS" />
            <KeyDot color="#94a3b8" label="CMS" />
          </div>
        </div>
        <div className="rounded-[26px] border border-ink/8 bg-gradient-to-br from-white to-mist/80 p-5">
          <div className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-ink/55">
            Node membership by state
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-sm font-medium text-layer1">Layer 1 drivers</div>
              <div className="flex flex-wrap gap-3">
                {universe.map((node) => (
                  <div
                    key={`l1-${node}`}
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-semibold ${
                      state.d1.includes(node)
                        ? "border-layer1/20 bg-layer1/12 text-layer1"
                        : "border-ink/10 bg-white text-ink/45"
                    }`}
                  >
                    {node}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-layer2">Layer 2 drivers</div>
              <div className="flex flex-wrap gap-3">
                {universe.map((node) => (
                  <div
                    key={`l2-${node}`}
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-semibold ${
                      state.d2.includes(node)
                        ? "border-layer2/20 bg-layer2/12 text-layer2"
                        : "border-ink/10 bg-white text-ink/45"
                    }`}
                  >
                    {node}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-[24px] border border-ink/8 bg-white/90 p-4">
            <div className="mb-3 text-sm font-medium text-ink">Partition view</div>
            <div className="grid grid-cols-5 gap-3">
              {partition.map((item) => (
                <div
                  key={item.node}
                  className="rounded-2xl p-3 text-center text-sm"
                  style={{ backgroundColor: `${item.color}18`, color: item.color }}
                >
                  <div className="text-xs uppercase tracking-[0.18em]">{item.label}</div>
                  <div className="mt-1 text-lg font-semibold">{item.node}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
