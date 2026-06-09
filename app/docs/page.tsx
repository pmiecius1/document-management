export default function Docs() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center">
      <p className="text-sm font-medium text-zinc-700">No document open</p>
      <p className="max-w-xs text-xs text-zinc-400">
        Select a document from the sidebar, or create a new one to get started.
      </p>
    </main>
  );
}
