"use client";

import { useEffect, useMemo, useState } from "react";
import { buildGraph, type GraphEdge, type GraphNode } from "@/lib/api";

type Tie = { relation: string; other: string };

const INVERSE: Record<string, string> = {
  "mother of": "child of",
  "father of": "child of",
  "parent of": "child of",
  "older brother of": "younger sibling of",
  "younger brother of": "older sibling of",
  "older sister of": "younger sibling of",
  "younger sister of": "older sibling of",
  "brother of": "sibling of",
  "sister of": "sibling of",
  "sibling of": "sibling of",
  "married to": "married to",
  "engaged to": "engaged to",
  "friend of": "friend of",
  "enemy of": "enemy of",
};

function inverseRelation(relation: string): string | null {
  return INVERSE[relation.trim().toLowerCase()] ?? null;
}

export function Cast({ bookId }: { bookId: string }) {
  const [data, setData] = useState<{
    nodes: GraphNode[];
    edges: GraphEdge[];
  } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    buildGraph(bookId)
      .then((res) => !cancelled && setData(res))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  const cast = useMemo(() => {
    if (!data) return [];
    const labelOf = new Map(data.nodes.map((n) => [n.id, n.label]));
    const ties = new Map<string, Tie[]>();
    for (const n of data.nodes) ties.set(n.id, []);
    for (const e of data.edges) {
      ties.get(e.source)?.push({
        relation: e.relation,
        other: labelOf.get(e.target) ?? e.target,
      });
      const inverse = inverseRelation(e.relation);
      if (inverse) {
        ties.get(e.target)?.push({
          relation: inverse,
          other: labelOf.get(e.source) ?? e.source,
        });
      }
    }
    return data.nodes
      .map((n) => ({ name: n.label, ties: ties.get(n.id) ?? [] }))
      .sort(
        (a, b) =>
          b.ties.length - a.ties.length || a.name.localeCompare(b.name),
      );
  }, [data]);

  if (!data && !failed) {
    return (
      <div className="mt-16 flex flex-col items-center text-center">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="mt-3 font-serif text-xs text-ink-faint">
          Mapping character ties from Supermemory thread…
        </p>
      </div>
    );
  }

  if (failed || cast.every((c) => c.ties.length === 0)) {
    return (
      <div className="mt-16 px-6 text-center">
        <p className="font-serif text-sm font-bold text-ink-soft">
          {failed ? "Supermemory Backend Offline" : "No Cast Ties Extracted Yet"}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">
          {failed
            ? "Verify backend connection at http://localhost:8000."
            : "Write manuscript scenes linking characters through family, ranks, or rivalries."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3">
      {cast
        .filter((c) => c.ties.length > 0)
        .map((c) => {
          const initials = c.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div key={c.name} className="rounded-2xl border border-border bg-paper-raised p-3.5 shadow-sm">
              <div className="flex items-center gap-3 border-b border-border-soft pb-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-soft font-bold text-xs text-gold-strong border border-gold/20">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-sm font-bold text-ink truncate">
                    {c.name}
                  </p>
                  <p className="text-[10px] font-mono text-ink-faint">
                    {c.ties.length} {c.ties.length === 1 ? "Relation" : "Relations"}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 space-y-1.5">
                {c.ties.map((t, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-paper-sunken/40 px-2.5 py-1.5 text-xs border border-border-soft">
                    <span className="font-mono text-[10px] font-semibold uppercase text-ink-faint">
                      {t.relation}
                    </span>
                    <span className="font-serif font-bold text-gold-strong">
                      {t.other}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}

