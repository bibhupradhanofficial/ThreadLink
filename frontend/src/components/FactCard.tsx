"use client";

import type { Contradiction, ContradictionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

function FactRow({
  label,
  chapterTitle,
  excerpt,
  tone,
  onJump,
}: {
  label: string;
  chapterTitle: string;
  excerpt: string;
  tone: "old" | "new";
  onJump: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onJump}
      className={cn(
        "group block w-full cursor-pointer text-left rounded-xl p-2.5 transition-all border",
        tone === "old"
          ? "bg-paper-raised/80 border-border hover:border-gold/40"
          : "bg-flag-soft/50 border-flag-red/20 hover:border-flag-red/40",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider",
            tone === "old" ? "text-ink-faint" : "text-flag-red",
          )}
        >
          {label}
        </span>
        <span className="text-[10px] font-mono text-ink-faint">{chapterTitle}</span>
      </div>
      <p className="mt-1 font-serif text-[13px] italic leading-snug text-ink transition-colors group-hover:text-gold-strong">
        &ldquo;{excerpt}&rdquo;
      </p>
    </button>
  );
}

export function FactCard({
  contradiction,
  isActive,
  onJump,
  onResolve,
}: {
  contradiction: Contradiction;
  isActive: boolean;
  onJump: (contradictionId: string, chapterId: string) => void;
  onResolve: (contradictionId: string, status: ContradictionStatus) => void;
}) {
  const { id, entity, oldFact, newFact, status, newFactContent } = contradiction;
  const resolved = status !== "unresolved";
  const fromProse = contradiction.oldFactSource === "derived";

  return (
    <div
      className={cn(
        "animate-fade-in p-4 rounded-xl transition-all border my-2 mx-3",
        isActive
          ? "bg-paper-raised shadow-md border-gold/50"
          : "bg-paper-raised/40 border-border-soft hover:border-border",
        resolved && !isActive && "opacity-75 bg-paper-sunken/40",
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border-soft pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "h-2 w-2 shrink-0 rounded-full",
              resolved ? "bg-kept" : "bg-flag-red animate-pulse",
            )}
          />
          <p className="min-w-0 flex-1 truncate font-serif text-sm font-bold text-ink">
            {entity}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            status === "unresolved"
              ? "bg-flag-soft text-flag-red border border-flag-red/20"
              : status === "kept-old"
                ? "bg-kept-soft text-kept border border-kept/20"
                : "bg-gold-soft text-gold-strong border border-gold/20",
          )}
        >
          {status === "unresolved"
            ? "Action Required"
            : status === "kept-old"
              ? "Kept Thread"
              : "Superseded"}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <FactRow
          label={fromProse ? "Supermemory Thread" : "Established Thread"}
          chapterTitle={oldFact.chapterTitle}
          excerpt={oldFact.excerpt}
          tone="old"
          onJump={() => onJump(id, oldFact.chapterId)}
        />
        <FactRow
          label="New Claim in Prose"
          chapterTitle={newFact.chapterTitle}
          excerpt={newFact.excerpt}
          tone="new"
          onJump={() => onJump(id, newFact.chapterId)}
        />
      </div>

      {status === "kept-new" && (
        <div className="mt-3 rounded-lg border border-gold/30 bg-gold-soft/50 p-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gold-strong">
            Version Lineage Update
          </p>
          <p className="mt-1 text-[11px] text-ink-faint">
            <span className="line-through">&ldquo;{oldFact.excerpt}&rdquo;</span> (superseded)
          </p>
          <p className="mt-0.5 font-serif text-xs font-semibold text-kept">
            &ldquo;{newFactContent ?? newFact.excerpt}&rdquo; (active canon)
          </p>
        </div>
      )}

      <div className="mt-3.5 pt-2 border-t border-border-soft">
        {!resolved ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onResolve(id, "kept-old")}
              className="flex-1 cursor-pointer rounded-lg border border-border bg-paper-raised px-2.5 py-1.5 text-xs font-semibold text-ink-soft transition-all hover:border-gold hover:text-ink"
            >
              {fromProse ? "Dismiss Conflict" : "Keep Established Thread"}
            </button>
            {!fromProse && (
              <button
                type="button"
                onClick={() => onResolve(id, "kept-new")}
                className="flex-1 cursor-pointer rounded-lg bg-ink px-2.5 py-1.5 text-xs font-semibold text-paper shadow transition-all hover:bg-gold-strong hover:shadow-md"
              >
                Supersede Thread
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onResolve(id, "unresolved")}
            className="cursor-pointer text-[11px] font-semibold text-ink-faint transition-colors hover:text-gold-strong"
          >
            ↩ Re-open Decision
          </button>
        )}
      </div>
    </div>
  );
}

