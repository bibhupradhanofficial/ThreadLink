"use client";

import type { Chapter, Contradiction } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Sidebar({
  chapters,
  activeChapterId,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  contradictions,
}: {
  chapters: Chapter[];
  activeChapterId: string;
  onSelectChapter: (id: string) => void;
  onAddChapter: () => void;
  onDeleteChapter: (id: string) => void;
  contradictions: Contradiction[];
}) {
  const totalWords = chapters.reduce((sum, c) => sum + c.wordCount, 0);

  const flagsForChapter = (chapterId: string) =>
    contradictions.filter(
      (c) => c.newFact.chapterId === chapterId && c.status === "unresolved",
    ).length;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-paper-sunken/40 glass-panel">
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-gold-strong text-xs">📜</span>
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink-faint">
            Table of Contents
          </p>
        </div>
        <span className="rounded-md bg-paper-sunken px-1.5 py-0.5 text-[10px] font-semibold text-ink-soft border border-border-soft">
          {chapters.length} Ch.
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 space-y-1 pb-3">
        {chapters.map((chapter) => {
          const active = chapter.id === activeChapterId;
          const flags = flagsForChapter(chapter.id);
          return (
            <div
              key={chapter.id}
              className={cn(
                "group flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs transition-all",
                active
                  ? "bg-paper-raised font-semibold text-ink shadow-sm border border-gold/30"
                  : "text-ink-soft hover:bg-paper-raised/60 hover:text-ink border border-transparent",
              )}
            >
              <button
                type="button"
                onClick={() => onSelectChapter(chapter.id)}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-left"
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold tabular-nums",
                    active
                      ? "bg-gold/15 text-gold-strong"
                      : "bg-paper-sunken text-ink-faint group-hover:text-ink-soft",
                  )}
                >
                  {chapter.index}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-[13px] leading-snug">{chapter.title}</p>
                  <p className="text-[10px] text-ink-faint tabular-nums">
                    {chapter.wordCount.toLocaleString()} words
                  </p>
                </div>
              </button>
              {flags > 0 && (
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-flag-red text-[9px] font-bold text-white shadow-sm animate-pulse"
                  title={`${flags} unresolved contradiction${flags === 1 ? "" : "s"}`}
                >
                  {flags}
                </span>
              )}
              {chapters.length > 1 && (
                <button
                  type="button"
                  onClick={() => onDeleteChapter(chapter.id)}
                  aria-label={`Delete chapter ${chapter.title}`}
                  title="Delete chapter"
                  className="shrink-0 cursor-pointer rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-flag-red focus:opacity-100 group-hover:opacity-100"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M3 4.5h10M6.5 4.5V3.5a1 1 0 011-1h1a1 1 0 011 1v1M5 4.5l.5 8a1 1 0 001 1h3a1 1 0 001-1l.5-8" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={onAddChapter}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-center text-xs font-semibold text-gold-strong transition-all hover:border-gold hover:bg-gold-soft/40"
        >
          <span>+</span>
          <span>Add Chapter</span>
        </button>
      </nav>

      <div className="border-t border-border-soft px-4 py-3.5 bg-paper-sunken/60">
        <div className="flex items-center justify-between text-[11px] tabular-nums text-ink-faint">
          <span>Manuscript Stats</span>
          <span className="font-semibold text-ink-soft">{totalWords.toLocaleString()} words</span>
        </div>
      </div>
    </aside>
  );
}

