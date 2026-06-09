import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Document Management</h1>
      <p className="max-w-md text-lg text-zinc-500">
        A simple, private workspace for creating and managing your documents.
        Everything is stored locally in your browser — no account required.
      </p>
      <Link
        href="/docs"
        className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Go to Workspace
      </Link>
    </main>
  );
}
