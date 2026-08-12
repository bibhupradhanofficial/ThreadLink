"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import type { Book } from "@/lib/types";
import { cn } from "@/lib/utils";

type SaveState = "saved" | "saving" | "offline";

function IconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-ink-faint transition-all hover:bg-ink/5 hover:text-ink focus:outline-none"
    >
      {children}
    </button>
  );
}

function PanelIcon({ side }: { side: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    >
      <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="2" />
      <path d={side === "left" ? "M6 2.75v10.5" : "M10 2.75v10.5"} />
    </svg>
  );
}

function BookSwitcher({
  books,
  activeBookId,
  onSelectBook,
  onAddBook,
  onRenameBook,
  onDeleteBook,
}: {
  books: Book[];
  activeBookId: string;
  onSelectBook: (id: string) => void;
  onAddBook: () => void;
  onRenameBook: (id: string, title: string) => void;
  onDeleteBook: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = books.find((b) => b.id === activeBookId);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-w-0 cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-ink-soft transition-all hover:bg-gold-soft/50 hover:text-ink"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-4 w-3.5 items-center justify-center rounded-[2px] bg-gold/20 text-[9px] font-bold text-gold-strong">
          📖
        </span>
        <span className="truncate max-w-[140px] font-serif">{active?.title}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-ink-faint"
        >
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div className="animate-fade-in absolute left-0 top-full z-30 mt-1.5 w-64 rounded-xl border border-border bg-paper-raised p-1.5 shadow-xl glass-panel">
          {active && (
            <>
              <div className="px-1 py-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                  Active Manuscript
                </span>
                <input
                  value={active.title}
                  onChange={(e) => onRenameBook(active.id, e.target.value)}
                  aria-label="Book title"
                  className="mt-1 w-full rounded-lg border border-border bg-paper-sunken px-2.5 py-1.5 font-serif text-xs font-semibold text-ink outline-none focus:border-gold placeholder:text-ink-faint"
                  placeholder="Manuscript Title"
                />
              </div>
              <div className="my-1.5 border-t border-border-soft" />
            </>
          )}
          <span className="px-1 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
            Library
          </span>
          <div className="mt-1 space-y-0.5 max-h-48 overflow-y-auto">
            {books.map((b) => (
              <div
                key={b.id}
                className={cn(
                  "group flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                  b.id === activeBookId
                    ? "bg-gold-soft font-semibold text-gold-strong"
                    : "text-ink-soft hover:bg-ink/5 hover:text-ink",
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectBook(b.id);
                    setOpen(false);
                  }}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
                >
                  <span className="truncate font-serif">{b.title}</span>
                  {b.id === activeBookId && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-gold-strong"
                    >
                      <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                    </svg>
                  )}
                </button>
                {books.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onDeleteBook(b.id)}
                    aria-label={`Delete book ${b.title}`}
                    title="Delete book"
                    className="shrink-0 cursor-pointer rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-flag-red focus:opacity-100 group-hover:opacity-100"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M3 4.5h10M6.5 4.5V3.5a1 1 0 011-1h1a1 1 0 011 1v1M5 4.5l.5 8a1 1 0 001 1h3a1 1 0 001-1l.5-8" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="my-1.5 border-t border-border-soft" />
          <button
            type="button"
            onClick={() => {
              onAddBook();
              setOpen(false);
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold text-gold-strong transition-colors hover:bg-gold-soft"
          >
            <span className="text-sm">+</span>
            Create New Manuscript
          </button>
        </div>
      )}
    </div>
  );
}

export function TopBar({
  books,
  activeBookId,
  onSelectBook,
  onAddBook,
  onRenameBook,
  onDeleteBook,
  chapterTitle,
  saveState,
  unresolvedCount,
  onCheckContinuity,
  checking,
  onToggleSidebar,
  onTogglePanel,
}: {
  books: Book[];
  activeBookId: string;
  onSelectBook: (id: string) => void;
  onAddBook: () => void;
  onRenameBook: (id: string, title: string) => void;
  onDeleteBook: (id: string) => void;
  chapterTitle: string;
  saveState: SaveState;
  unresolvedCount: number;
  onCheckContinuity: () => void;
  checking: boolean;
  onToggleSidebar: () => void;
  onTogglePanel: () => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-paper-raised/60 px-4 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-1.5">
        <IconButton onClick={onToggleSidebar} label="Toggle chapter list">
          <PanelIcon side="left" />
        </IconButton>
        <div className="flex min-w-0 items-center gap-1.5 pl-1">
          <Link
            href="/"
            title="Back to manuscript landing page"
            className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 font-serif text-sm font-bold tracking-tight text-ink transition-colors hover:text-gold-strong"
          >
            <span className="text-gold-strong">✦</span> ThreadLink
          </Link>
          <span className="text-xs text-ink-faint">/</span>
          <BookSwitcher
            books={books}
            activeBookId={activeBookId}
            onSelectBook={onSelectBook}
            onAddBook={onAddBook}
            onRenameBook={onRenameBook}
            onDeleteBook={onDeleteBook}
          />
          <span className="text-xs text-ink-faint">/</span>
          <span className="min-w-0 truncate font-serif text-xs font-medium text-ink-soft max-w-[160px]">
            {chapterTitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {saveState === "offline" ? (
          <span
            className="flex items-center gap-1.5 rounded-full border border-flag/30 bg-flag-soft px-2.5 py-0.5 text-xs font-semibold text-flag"
            title="Backend offline — changes exist in memory only."
          >
            <span className="h-1.5 w-1.5 rounded-full bg-flag animate-pulse" />
            Backend Offline
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-ink-faint">
            <span className={cn("h-1.5 w-1.5 rounded-full", saveState === "saving" ? "bg-gold animate-ping" : "bg-kept")} />
            {saveState === "saving" ? "Saving…" : "Canon Synced"}
          </span>
        )}

        {unresolvedCount > 0 && !checking && (
          <span className="flex items-center gap-1 rounded-full border border-flag-red/30 bg-flag-soft px-2.5 py-0.5 text-xs font-semibold text-flag-red">
            <span>⚠️</span> {unresolvedCount} Open Conflicts
          </span>
        )}

        <button
          type="button"
          onClick={onCheckContinuity}
          disabled={checking}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-ink px-3.5 py-1.5 text-xs font-semibold text-paper shadow-md transition-all hover:bg-ink/85 hover:shadow-lg disabled:cursor-wait disabled:opacity-60"
        >
          {checking ? (
            <>
              <span className="h-2 w-2 animate-spin rounded-full border-2 border-paper border-t-transparent" />
              Scanning Canon…
            </>
          ) : (
            <>
              <span>✦</span> Check Continuity
            </>
          )}
        </button>

        <div className="flex items-center gap-1 border-l border-border-soft pl-2">
          <IconButton onClick={onTogglePanel} label="Toggle continuity drawer">
            <PanelIcon side="right" />
          </IconButton>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

