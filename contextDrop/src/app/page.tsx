import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Braces,
  Check,
  GitBranch,
  Github,
  Search,
  Sparkles,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./_components/landing-motion";

const features = [
  {
    icon: Search,
    title: "Find the right code",
    description:
      "Ask a question in plain language and get answers grounded in the files that matter.",
  },
  {
    icon: GitBranch,
    title: "Get oriented faster",
    description:
      "Connect a GitHub repository and browse project activity with commit summaries.",
  },
  {
    icon: Bot,
    title: "Keep your team in sync",
    description:
      "Invite teammates to the same project and share useful answers as you learn.",
  },
];

const steps = [
  "Connect a GitHub repository",
  "Let ContextDrop index the code",
  "Ask questions and explore answers",
];

export default function Home() {
  return (
    <main
      id="top"
      className="min-h-screen overflow-hidden bg-background text-foreground"
    >
      <header className="relative z-10 border-b bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="ContextDrop home"
          >
            <Image src="/logo.png" alt="" width={34} height={34} priority />
            <span className="text-lg font-bold tracking-tight text-primary">
              ContextDrop
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 text-sm text-muted-foreground md:flex"
          >
            <Link
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="transition-colors hover:text-foreground"
            >
              How it works
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="shadow-sm">
                  Get started <ArrowRight />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href="/dashboard">
                  Open workspace <ArrowRight />
                </Link>
              </Button>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      <section className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.12),transparent_55%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:py-28">
          <Reveal className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-800">
              <Sparkles className="size-3.5" />
              Your codebase, easier to understand
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Get context on any codebase,{" "}
              <span className="text-primary">faster.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Connect a GitHub repository, ask questions in plain language, and
              find your way around unfamiliar code with answers tied to real
              files.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="h-11 px-6 shadow-md shadow-blue-600/15"
                  >
                    Start with a repository <ArrowRight />
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button size="lg" variant="outline" className="h-11 px-6">
                    I already have an account
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-6 shadow-md shadow-blue-600/15"
                >
                  <Link href="/create">
                    Connect a repository <ArrowRight />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 px-6"
                >
                  <Link href="/dashboard">Open workspace</Link>
                </Button>
              </SignedIn>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-primary" /> Answers grounded in
                your repository
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-primary" /> Built for teams and
                solo developers
              </span>
            </div>
          </Reveal>

          <Reveal
            className="relative mx-auto w-full max-w-xl lg:ml-auto"
            delay={0.12}
          >
            <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-blue-200/40 blur-3xl" />
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
              <div className="flex items-center justify-between border-b bg-slate-50 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
                    <Github className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">acme / storefront</p>
                    <p className="text-xs text-muted-foreground">
                      Repository connected
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Indexed
                </span>
              </div>
              <div className="space-y-5 p-5 sm:p-6">
                <div className="rounded-xl border bg-slate-50 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Ask your project
                  </p>
                  <p className="text-sm text-slate-700">
                    Where is the checkout flow handled?
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Search className="size-3.5" /> Search indexed files
                    </span>
                    <span className="flex size-6 items-center justify-center rounded-md bg-primary text-white">
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Bot className="size-4 text-primary" /> ContextDrop answer
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    The checkout flow starts in{" "}
                    <code className="rounded bg-blue-50 px-1 py-0.5 text-xs text-blue-800">
                      src/checkout
                    </code>
                    . The page creates an order, then the payment handler
                    verifies the result.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 border-t pt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-md border bg-white px-2.5 py-1.5 text-xs text-slate-600">
                    <Braces className="size-3.5 text-primary" />{" "}
                    src/checkout/page.tsx
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md border bg-white px-2.5 py-1.5 text-xs text-slate-600">
                    <Braces className="size-3.5 text-primary" />{" "}
                    src/checkout/actions.ts
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-xl border bg-white px-4 py-3 shadow-lg sm:flex lg:-left-8">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-primary">
                <GitBranch className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold">Project activity</p>
                <p className="text-[11px] text-muted-foreground">
                  Understand changes at a glance
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="features" className="scroll-mt-20 border-y bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Made for the moment you join a project
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Less searching. More understanding.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Get the answers and project context you need to move from
              unfamiliar to productive.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, index) => (
              <Reveal key={title} delay={index * 0.1} liftOnHover>
                <article className="h-full rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              A simple workflow
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Start with your repository.
            </h2>
            <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
              ContextDrop connects your code, finds relevant files, and gives
              your team a more direct way to explore how a project works.
            </p>
            <Link
              href="#top"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Back to the top <ArrowDown className="size-4 rotate-180" />
            </Link>
          </Reveal>
          <Reveal>
            <ol className="space-y-4">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm sm:p-5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                    0{index + 1}
                  </span>
                  <span className="font-medium">{step}</span>
                  {index < steps.length - 1 && (
                    <ArrowRight className="ml-auto hidden size-4 text-muted-foreground sm:block" />
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-24">
        <Reveal className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary px-6 py-9 text-white sm:px-10 sm:py-11 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Your next project can feel familiar.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Connect a repository and start asking better questions about
                your code.
              </p>
            </div>
            <SignedOut>
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  variant="secondary"
                  className="shrink-0 bg-white text-primary hover:bg-blue-50"
                >
                  Get started <ArrowRight />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="shrink-0 bg-white text-primary hover:bg-blue-50"
              >
                <Link href="/create">
                  Connect a repository <ArrowRight />
                </Link>
              </Button>
            </SignedIn>
          </div>
        </Reveal>
      </section>

      <footer className="border-t bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground"
          >
            <Image src="/logo.png" alt="" width={24} height={24} /> ContextDrop
          </Link>
          <p>Understand your codebase with more context.</p>
          <SignedIn>
            <Link
              href="/dashboard"
              className="font-medium text-primary hover:underline"
            >
              Go to workspace
            </Link>
          </SignedIn>
        </div>
      </footer>
    </main>
  );
}
