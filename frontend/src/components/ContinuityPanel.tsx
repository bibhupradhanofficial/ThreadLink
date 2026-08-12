"use client";

import { useEffect, useRef, useState } from "react";
import type { Contradiction, ContradictionStatus } from "@/lib/types";
import { FactCard } from "./FactCard";
import { StoryBible } from "./StoryBible";
import { Cast } from "./Cast";
import { cn } from "@/lib/utils";

export function ContinuityPanel({
  bookId,
  canonRefreshKey = 0,
  contradictions,
  activeContradictionId,
  focusNonce = 0,
  checking,
  checkPhase,
  checked,
  onJump,
  onResolve,
}: {
  bookId: string;
  canonRefreshKey?: number;
  contradictions: Contradiction[];
  activeContradictionId: string | null;
  focusNonce?: number;
  checking: boolean;
  checkPhase: string | null;
  checked: boolean;
  onJump: (contradictionId: string, chapterId: string) => void;
  onResolve: (contradictionId: string, status: ContradictionStatus) => void;
}) {
  const [tab, setTab] = useState<"issues" | "bible" | "cast">("issues");
  const unresolved = contradictions.filter((c) => c.status === "unresolved");
  const resolved = contradictions.filter((c) => c.status !== "unresolved");

  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const setCardRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  };

  useEffect(() => {
    if (!activeContradictionId) return;
    const el = cardRefs.current.get(activeContradictionId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    el.classList.remove("card-shake");
    void el.offsetWidth;
    el.classList.add("card-shake");
  }, [activeContradictionId, focusNonce]);

  return (
    <aside className="flex w-96 shrink-0 flex-col border-l border-border bg-paper-sunken/40 glass-panel">
      <div className="border-b border-border-soft px-5 pt-5 pb-0">
        <div className="flex items-center justify-between">
          <p className="font-serif text-sm font-bold text-ink">
            {tab === "issues"
              ? "Continuity Engine"
              : tab === "bible"
                ? "Story Bible Thread"
                : "Cast Relationship Map"}
          </p>
          <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse" />
        </div>
        <p className="mt-1 text-xs text-ink-faint">
          {tab === "cast"
            ? "Extracted character network & ties"
            : tab === "bible"
              ? "Living thread facts & version history"
              : checking
                ? "Analyzing manuscript claims..."
                : !checked
                  ? "Awaiting continuity check"
                  : unresolved.length === 0
                    ? "All manuscript lines agree"
                    : `${unresolved.length} open contradictions requiring decision`}
        </p>

        {/* Tab Buttons */}
        <div className="mt-4 flex rounded-xl bg-paper-sunken p-1 border border-border-soft">
          {(
            [
              ["issues", "Issues"],
              ["bible", "Story Bible"],
              ["cast", "Cast"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "flex-1 cursor-pointer rounded-lg py-1.5 text-center text-xs font-semibold transition-all",
                tab === key
                  ? "bg-paper-raised text-ink shadow-sm border border-border"
                  : "text-ink-faint hover:text-ink-soft",
              )}
            >
              {label}
              {key === "issues" && unresolved.length > 0 && (
                <span className="ml-1.5 rounded-full bg-flag-red px-1.5 py-0.2 text-[9px] font-bold text-white">
                  {unresolved.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {tab === "cast" ? (
          <Cast key={bookId} bookId={bookId} />
        ) : tab === "bible" ? (
          <StoryBible key={bookId} bookId={bookId} refreshKey={canonRefreshKey} />
        ) : checking ? (
          <div className="mt-20 flex flex-col items-center px-6 text-center">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            <p className="mt-4 font-serif text-sm font-semibold text-ink">
              Analyzing Thread Entailment
            </p>
            <p className="mt-1 animate-pulse text-xs text-ink-faint">
              {checkPhase}
            </p>
          </div>
        ) : contradictions.length === 0 ? (
          <div className="mt-20 px-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-kept-soft text-kept text-xl">
              ✓
            </div>
            <p className="mt-4 font-serif text-base font-bold text-ink">
              {checked ? "Manuscript Canon Verified" : "Ready for Continuity Check"}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              {checked
                ? "Every line in this manuscript aligns with established story facts on Supermemory."
                : "Click 'Check Continuity' in the top toolbar to audit manuscript facts."}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {unresolved.map((c) => (
              <div key={c.id} ref={setCardRef(c.id)}>
                <FactCard
                  contradiction={c}
                  isActive={c.id === activeContradictionId}
                  onJump={onJump}
                  onResolve={onResolve}
                />
              </div>
            ))}

            {resolved.length > 0 && (
              <div className="pt-4">
                <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                  Resolved Conflicts ({resolved.length})
                </p>
                {resolved.map((c) => (
                  <div key={c.id} ref={setCardRef(c.id)}>
                    <FactCard
                      contradiction={c}
                      isActive={c.id === activeContradictionId}
                      onJump={onJump}
                      onResolve={onResolve}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border-soft px-5 py-3 bg-paper-sunken/60">
        <p className="text-[11px] leading-relaxed text-ink-faint">
          ✦ Every decision version-bumps Supermemory Cloud memory.
        </p>
      </div>
    </aside>
  );
}

