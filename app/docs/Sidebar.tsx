"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";

export default function Sidebar() {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const documents = useLiveQuery(
    () => db.documents.orderBy("updatedAt").reverse().toArray(),
    []
  );

  const filtered = documents?.filter((doc) =>
    doc.title.toLowerCase().includes(query.toLowerCase())
  );

  async function handleNewDocument() {
    const id = await db.documents.add({
      title: "Untitled",
      content: "",
      updatedAt: Date.now(),
      createdAt: Date.now(),
    });
    router.push(`/docs/${id}`);
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-200">
      <div className="border-b border-zinc-200 px-4 py-4">
        <button
          onClick={handleNewDocument}
          className="mb-3 w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          New Document
        </button>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Documents
        </h2>
        <input
          type="search"
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 focus:ring-0"
        />
      </div>
      <ul className="flex-1 overflow-y-auto py-2">
        {filtered === undefined ? null : filtered.length === 0 ? (
          <li className="px-4 py-3 text-sm text-zinc-400">
            {query ? "No matching documents." : "No documents yet."}
          </li>
        ) : (
          filtered.map((doc) => (
            <li key={doc.id}>
              <button
                onClick={() => router.push(`/docs/${doc.id}`)}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  pathname === `/docs/${doc.id}`
                    ? "bg-zinc-100 font-medium text-zinc-900"
                    : "text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {doc.title}
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
