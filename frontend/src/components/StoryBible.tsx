"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getCanon,
  getDerived,
  getBookTimeline,
  forgetMemory,
  type CanonEntry,
  type DerivedMemory,
  type MemoryMeta,
  type TimelineEvent,
} from "@/lib/api";

function RawRecord({ raw }: { raw: MemoryMeta }) {
  return (
    <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 rounded-lg border border-border-soft bg-paper-sunken px-2.5 py-2 font-mono text-[10px] leading-relaxed text-ink-faint">
      <dt className="font-bold">memoryId</dt>
      <dd className="truncate text-ink-soft">{raw.memoryId}</dd>
      <dt className="font-bold">container</dt>
      <dd className="truncate text-ink-soft">{raw.containerTag}</dd>
      <dt className="font-bold">version</dt>
      <dd className="text-gold-strong font-semibold">
        v{raw.version ?? 1}
        {raw.isLatest ? " · active" : ""}
      </dd>
      {raw.rootMemoryId && raw.rootMemoryId !== raw.memoryId && (
        <>
          <dt className="font-bold">rootId</dt>
          <dd className="truncate text-ink-soft">{raw.rootMemoryId}</dd>
        </>
      )}
      <dt className="font-bold">updated</dt>
      <dd className="truncate text-ink-soft">{raw.updatedAt}</dd>
    </dl>
  );
}

export function StoryBible({
  bookId,
  refreshKey = 0,
}: {
  bookId: string;
  refreshKey?: number;
}) {
  const [entries, setEntries] = useState<CanonEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [audit, setAudit] = useState(false);
  const [tab, setTab] = useState<"canon" | "derived" | "timeline">("canon");
  const [derived, setDerived] = useState<DerivedMemory[] | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[] | null>(null);
  const [query, setQuery] = useState("");
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getCanon(bookId)
      .then((res) => {
        if (cancelled) return;
        setEntries(res.entries);
        setFailed(false);
      })
      .catch(() => {
        if (cancelled) return;
        setFailed(true);
        setEntries([]);
      });
    return () => {
      cancelled = true;
    };
  }, [bookId, reloadNonce, refreshKey]);

  useEffect(() => {
    let cancelled = false;
    getDerived(bookId)
      .then((res) => !cancelled && setDerived(res.memories))
      .catch(() => !cancelled && setDerived([]));
    return () => {
      cancelled = true;
    };
  }, [bookId, reloadNonce, refreshKey]);

  useEffect(() => {
    let cancelled = false;
    getBookTimeline(bookId)
      .then((res) => !cancelled && setTimelineEvents(res.events))
      .catch(() => !cancelled && setTimelineEvents([]));
    return () => {
      cancelled = true;
    };
  }, [bookId, reloadNonce, refreshKey]);

  const filteredEntries = useMemo(() => {
    if (!query.trim()) return entries ?? [];
    const q = query.toLowerCase();
    return (entries ?? []).filter(
      (e) =>
        e.entity.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        (e.attribute && e.attribute.toLowerCase().includes(q)),
    );
  }, [entries, query]);

  const groups = useMemo(() => {
    const byEntity = new Map<string, CanonEntry[]>();
    for (const e of filteredEntries) {
      const list = byEntity.get(e.entity) ?? [];
      list.push(e);
      byEntity.set(e.entity, list);
    }
    return Array.from(byEntity.entries());
  }, [filteredEntries]);

  const handleForget = (id: string) => {
    const r = reason.trim() || "Removed from canon by the author";
    setConfirmId(null);
    setReason("");
    setEntries((prev) => (prev ?? []).filter((e) => e.id !== id));
    forgetMemory(bookId, id, r).catch(() => setReloadNonce((n) => n + 1));
  };

  if (entries === null) {
    return (
      <div className="mt-20 flex flex-col items-center text-center">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="mt-3 font-serif text-xs text-ink-faint">
          Consulting Supermemory Story Bible…
        </p>
      </div>
    );
  }

  const header = (
    <div className="border-b border-border-soft px-4 py-3 bg-paper-sunken/50">
      <div className="flex items-center justify-between gap-2">
        <div className="flex rounded-lg bg-paper-sunken p-1 border border-border-soft">
          {(["canon", "derived", "timeline"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                tab === t
                  ? "bg-paper-raised text-ink shadow-sm"
                  : "text-ink-faint hover:text-ink"
              }`}
            >
              {t === "canon" ? "Curated Canon" : t === "derived" ? "Derived Pass" : "Timeline"}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAudit((v) => !v)}
          aria-pressed={audit}
          className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-bold transition-all border ${
            audit
              ? "bg-gold text-white border-gold shadow"
              : "border-border text-ink-faint hover:bg-paper-raised hover:text-ink"
          }`}
        >
          Audit JSON
        </button>
      </div>

      {tab === "canon" && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entities, facts, or attributes..."
          className="mt-3.5 w-full rounded-xl border border-border bg-paper-raised px-3 py-1.5 font-sans text-xs text-ink outline-none focus:border-gold placeholder:text-ink-faint"
        />
      )}

      <p className="mt-2 text-[10px] font-mono text-ink-faint">
        {tab === "canon" ? (
          <>
            {filteredEntries.length} facts indexed · Tag: <span className="text-gold-strong">book_{bookId}</span>
          </>
        ) : tab === "derived" ? (
          <>
            {derived?.length ?? 0} derived memories · Tag: <span className="text-gold-strong">book_{bookId}:chapters</span>
          </>
        ) : (
          <>
            {timelineEvents?.length ?? 0} timeline events recorded
          </>
        )}
      </p>
    </div>
  );

  if (entries.length === 0 && tab === "canon") {
    return (
      <div>
        {header}
        <div className="mt-16 px-6 text-center">
          <p className="font-serif text-sm font-bold text-ink-soft">
            {failed ? "Supermemory Backend Offline" : "No Canon Facts Established"}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-faint">
            {failed
              ? "Check that backend server is listening at http://localhost:8000."
              : "As you write manuscript chapters, established facts will automatically index here."}
          </p>
        </div>
      </div>
    );
  }

  if (tab === "timeline") {
    return (
      <div>
        {header}
        {timelineEvents === null ? (
          <p className="mt-10 animate-pulse text-center text-xs text-ink-faint">
            Loading story timeline...
          </p>
        ) : timelineEvents.length === 0 ? (
          <div className="mt-10 px-6 text-center">
            <p className="font-serif text-sm font-bold text-ink-soft">
              No Timeline Anchors Yet
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">
              As facts with time expressions (dates, ages, relative offsets) are extracted, they will build an interactive story timeline here.
            </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-gold/30 ml-6 my-4 space-y-6 pr-4">
            {timelineEvents.map((ev, i) => (
              <div key={ev.id || i} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-gold bg-paper-raised" />
                <div className="rounded-xl border border-border bg-paper-raised p-3 shadow-sm">
                  <div className="flex items-center justify-between gap-2 border-b border-border-soft pb-1.5 mb-2">
                    <span className="font-mono text-xs font-bold text-gold-strong">
                      {ev.timeAnchor || "Chapter Event"}
                    </span>
                    <span className="rounded bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold text-ink-faint">
                      {ev.chapterTitle || `Chapter ${ev.chapterIndex ?? "?"}`}
                    </span>
                  </div>
                  <p className="font-serif text-xs leading-relaxed text-ink font-medium">
                    &ldquo;{ev.statement}&rdquo;
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px]">
                    <span className="rounded-full bg-gold-soft px-2 py-0.5 font-bold text-gold-strong">
                      {ev.entity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (tab === "derived") {
    return (
      <div>
        {header}
        {derived === null ? (
          <p className="mt-10 animate-pulse text-center text-xs text-ink-faint">
            Fetching Supermemory derived memories…
          </p>
        ) : derived.length === 0 ? (
          <div className="mt-10 px-6 text-center">
            <p className="font-serif text-sm font-bold text-ink-soft">
              Derived Pass Pending
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">
              Run a full continuity check to trigger Supermemory reference resolution.
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-3">
            {derived.map((m) => (
              <div key={m.id} className="rounded-xl border border-border bg-paper-raised p-3 shadow-sm">
                <p className="font-serif text-xs italic leading-relaxed text-ink">
                  &ldquo;{m.content}&rdquo;
                </p>
                <div className="mt-2 flex items-center justify-between border-t border-border-soft pt-1.5 text-[10px] text-ink-faint">
                  <span>{m.chapterTitle || "Derived prose memory"}</span>
                  <span className="font-mono text-gold-strong">Derived</span>
                </div>
                {audit && m.raw && <RawRecord raw={m.raw} />}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {header}
      <div className="space-y-3 p-3">
        {groups.map(([entity, list]) => (
          <div key={entity} className="rounded-2xl border border-border bg-paper-raised p-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-border-soft pb-2">
              <span className="font-serif text-sm font-bold text-ink">{entity}</span>
              <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-bold text-gold-strong border border-gold/20">
                {list.length} {list.length === 1 ? "Fact" : "Facts"}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {list.map((e) => (
                <div key={e.id} className="group/entry rounded-xl bg-paper-sunken/40 p-2.5 border border-border-soft">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-xs italic leading-relaxed text-ink">
                        &ldquo;{e.content}&rdquo;
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-ink-faint">
                        {e.attribute && (
                          <span className="rounded bg-paper px-1.5 py-0.5 font-mono font-semibold text-ink-soft">
                            {e.attribute}
                          </span>
                        )}
                        <span>{e.chapterTitle || "Chapter fact"}</span>
                        {(e.version ?? 1) > 1 && (
                          <span className="rounded bg-kept-soft px-1.5 py-0.5 font-bold text-kept">
                            v{e.version} Active
                          </span>
                        )}
                      </div>

                      {e.history.length > 0 && (
                        <div className="mt-2 rounded-lg border border-border-soft bg-paper-raised p-2">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-ink-faint mb-1">
                            Superseded History Lineage
                          </p>
                          {e.history.map((h, i) => (
                            <p key={i} className="font-serif text-[11px] leading-snug text-ink-faint line-through">
                              &ldquo;{h.content}&rdquo;
                            </p>
                          ))}
                        </div>
                      )}

                      {audit && e.raw && <RawRecord raw={e.raw} />}
                    </div>

                    <button
                      type="button"
                      onClick={() => setConfirmId(confirmId === e.id ? null : e.id)}
                      aria-label="Forget from canon"
                      title="Forget from canon"
                      className="shrink-0 cursor-pointer rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-flag-red group-hover/entry:opacity-100"
                    >
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 4l8 8M12 4l-8 8" />
                      </svg>
                    </button>
                  </div>

                  {confirmId === e.id && (
                    <div className="animate-fade-in mt-2.5 rounded-xl border border-flag-red/30 bg-flag-soft p-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-flag-red mb-1">
                        Forget Fact from Canon
                      </p>
                      <input
                        value={reason}
                        onChange={(ev) => setReason(ev.target.value)}
                        placeholder="Reason for deletion (optional)"
                        className="w-full rounded-lg border border-border bg-paper px-2.5 py-1 text-xs text-ink outline-none focus:border-flag-red placeholder:text-ink-faint"
                        autoFocus
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter") handleForget(e.id);
                          if (ev.key === "Escape") setConfirmId(null);
                        }}
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          className="cursor-pointer text-xs font-semibold text-ink-soft hover:text-ink"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleForget(e.id)}
                          className="cursor-pointer rounded-lg bg-flag-red px-3 py-1 text-xs font-bold text-white shadow hover:bg-flag-red-strong"
                        >
                          Confirm Forget
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

