export default function Docs() {
  return (
    <div className="flex flex-1 flex-row overflow-hidden">
      <aside className="w-64 shrink-0 border-r border-zinc-200 px-4 py-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Documents
        </h2>
        <p className="text-sm text-zinc-400">No documents yet.</p>
      </aside>
      <main className="flex flex-1 items-center justify-center">
        <p className="text-zinc-400">Select a document to get started.</p>
      </main>
    </div>
  );
}
