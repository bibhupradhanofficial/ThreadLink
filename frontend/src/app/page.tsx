import Link from "next/link";
import { ThreadLinkLogo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const FEATURES = [
  {
    badge: "Realtime Intelligence",
    title: "Continuity, checked as you write",
    body: "Every paragraph is distilled into canonical facts. Give a character grey eyes in chapter three when chapter one established green, and the line flags inline before your editor ever sees it.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    badge: "Version Lineage",
    title: "Thread that remembers its past",
    body: "Decisions version your story memory instead of overwriting it. Superseded facts keep their full lineage in the Story Bible with exact chapter provenance.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    badge: "Cast & Network",
    title: "A live map of who is who",
    body: "Kinship, ranks, rivalries, and workplaces are extracted directly from established canon into an interactive visual relationship graph. No manual tagging required.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="5" r="3" />
        <circle cx="5" cy="19" r="3" />
        <circle cx="19" cy="19" r="3" />
        <path d="M12 8v4M7.5 17.5l3-3.5M16.5 17.5l-3-3.5" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-paper">
      {/* Top Header */}
      <header className="flex h-16 items-center justify-between border-b border-border-soft px-6 sm:px-12">
        <div className="flex items-center gap-2.5">
          <ThreadLinkLogo className="h-9 w-9" />
          <span className="font-serif text-lg font-bold tracking-tight text-ink">
            ThreadLink
          </span>
          <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-semibold text-gold-strong">
            ATELIER
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/editor"
            className="group flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-semibold text-ink transition-all hover:border-gold hover:bg-gold-soft hover:text-gold-strong"
          >
            <span>Enter Manuscript Atelier</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />

        <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold-soft/60 px-3 py-1 text-xs font-medium text-gold-strong backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          Manuscript Thread Engine & Realtime Memory
        </div>

        <h1 className="mt-6 max-w-3xl font-serif text-5xl font-extrabold leading-tight tracking-tight text-ink sm:text-6xl sm:leading-none">
          Write the story.
          <br />
          <span className="bg-gradient-to-r from-ink via-gold-strong to-ink bg-clip-text text-transparent">
            It remembers the thread.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
          ThreadLink catches continuity errors inline as you type and maintains a living Story Bible of your world, powered by Supermemory Cloud.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/editor"
            className="flex items-center gap-2.5 rounded-xl bg-ink px-7 py-3.5 text-sm font-semibold text-paper shadow-xl transition-all hover:bg-ink/90 hover:shadow-2xl hover:scale-[1.02]"
          >
            <span>Launch Editor Workbench</span>
            <span>→</span>
          </Link>
        </div>

        {/* Live Demo Manuscript Preview Card */}
        <div className="mt-14 w-full max-w-3xl rounded-2xl border border-border bg-paper-raised p-6 text-left shadow-2xl shadow-black/10 glass-panel">
          <div className="flex items-center justify-between border-b border-border-soft pb-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-flag-red/80" />
              <span className="h-3 w-3 rounded-full bg-gold/80" />
              <span className="h-3 w-3 rounded-full bg-kept/80" />
              <span className="ml-2 font-mono text-xs font-medium text-ink-faint">
                The Return — Chapter 4
              </span>
            </div>
            <span className="rounded-md bg-flag-soft px-2.5 py-1 text-[11px] font-semibold text-flag">
              1 Contradiction Detected
            </span>
          </div>

          <div className="mt-5 font-serif text-base leading-relaxed text-ink">
            <p>
              Captain Reyes adjusted his collar and looked across the open courtyard. The midday sun beat heavily upon the cobblestones. Without pausing to check for guards,{" "}
              <mark className="contradiction rounded px-1.5 py-0.5">
                Reyes sprinted across the courtyard
              </mark>{" "}
              toward the north gate.
            </p>
          </div>

          {/* Callout box showing canon conflict */}
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-flag-red/30 bg-flag-soft/70 p-3.5">
            <div className="mt-0.5 shrink-0 text-flag-red">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8" cy="8" r="7" />
                <path d="M8 4v5M8 11.5h.01" />
              </svg>
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-flag-strong">Contradicts Chapter 1 Canon</span>
                <span className="text-[10px] text-ink-faint">The Varek Ridge</span>
              </div>
              <p className="mt-1 font-serif italic text-ink-soft">
                &ldquo;The war had taken both his legs at Varek Ridge...&rdquo;
              </p>
              <p className="mt-1 font-sans text-ink-faint">
                Reasoning: Captain Reyes lost both legs, making sprinting impossible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="border-t border-border-soft bg-paper-sunken px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-ink">Built for Worldbuilding Precision</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Every detail of your world stays organized, search-indexed, and logically consistent.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-paper-raised p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-gold/50 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-soft text-gold-strong transition-colors group-hover:bg-gold group-hover:text-white">
                  {f.icon}
                </div>
                <span className="mt-4 block text-[11px] font-bold uppercase tracking-wider text-gold-strong">
                  {f.badge}
                </span>
                <h3 className="mt-1 font-serif text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text.xs leading-relaxed text-ink-soft">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-soft px-6 py-6 text-center">
        <p className="text-xs text-ink-faint">
          Powered by <span className="font-semibold text-ink-soft">Supermemory Cloud</span> - Real time manuscript thread reasoning.
        </p>
      </footer>
    </main>
  );
}

