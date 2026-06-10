"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";
import ThemeToggle from "@/app/ThemeToggle";

interface PendingDelete {
  id: number;
  title: string;
}

export default function Sidebar() {
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const documents = useLiveQuery(
    () => db.documents.orderBy("updatedAt").reverse().toArray(),
    []
  );

  const filtered = documents
    ?.filter((doc) => doc.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (!!a.starred === !!b.starred) return 0;
      return a.starred ? -1 : 1;
    });

  async function toggleStar(id: number, current: boolean) {
    await db.documents.update(id, { starred: !current });
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    await db.documents.delete(pendingDelete.id);
    if (pathname === `/docs/${pendingDelete.id}`) router.push("/docs");
    setPendingDelete(null);
  }

  async function handleNewDocument() {
    const id = await db.documents.add({
      title: "Untitled",
      content: "",
      starred: false,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    });
    router.push(`/docs/${id}`);
  }

  return (
    <>
      <aside className="flex w-full shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 md:w-64">
        <div className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <button
            onClick={handleNewDocument}
            className="mb-3 w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            New Document
          </button>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Documents
          </h2>
          <input
            type="search"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-600 dark:focus:border-zinc-500"
          />
        </div>
        <ul className="flex-1 overflow-y-auto py-2">
          {filtered === undefined ? null : filtered.length === 0 ? (
            <li className="px-4 py-6">
              {query ? (
                <>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No results</p>
                  <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">No documents match &ldquo;{query}&rdquo;.</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No documents yet</p>
                  <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">Click New Document to create your first one.</p>
                </>
              )}
            </li>
          ) : (
            filtered.map((doc) => (
              <li
                key={doc.id}
                className={`group flex items-center transition-colors ${
                  pathname === `/docs/${doc.id}`
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                <button
                  onClick={() => toggleStar(doc.id!, !!doc.starred)}
                  className={`ml-2 shrink-0 rounded px-1 py-1 text-base transition-colors ${
                    doc.starred
                      ? "text-amber-400 hover:text-amber-500"
                      : "text-zinc-200 hover:text-zinc-400 group-hover:text-zinc-300 dark:text-zinc-700 dark:group-hover:text-zinc-500"
                  }`}
                  aria-label={doc.starred ? "Unstar document" : "Star document"}
                >
                  {doc.starred ? "★" : "☆"}
                </button>
                <button
                  onClick={() => router.push(`/docs/${doc.id}`)}
                  className={`flex-1 px-3 py-2.5 text-left text-sm ${
                    pathname === `/docs/${doc.id}`
                      ? "font-medium text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {doc.title}
                </button>
                <button
                  onClick={() => setPendingDelete({ id: doc.id!, title: doc.title })}
                  className="mr-2 hidden rounded px-1.5 py-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 group-hover:block dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                  aria-label="Delete document"
                >
                  ✕
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="flex items-center justify-end border-t border-zinc-200 px-3 py-2 dark:border-zinc-800">
          <ThemeToggle />
        </div>
      </aside>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/50">
          <div className="w-80 rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Delete document</h2>
            <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
              &ldquo;{pendingDelete.title || "Untitled"}&rdquo; will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPendingDelete(null)}
                className="rounded-md border border-zinc-200 px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
