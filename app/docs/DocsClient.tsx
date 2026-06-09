"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";
import Sidebar from "./Sidebar";

export default function DocsClient() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedDoc = useLiveQuery(
    () => (selectedId !== null ? db.documents.get(selectedId) : undefined),
    [selectedId]
  );

  return (
    <div className="flex flex-1 flex-row overflow-hidden">
      <Sidebar selectedId={selectedId} onSelect={setSelectedId} />
      <main className="flex flex-1 items-center justify-center">
        {selectedDoc ? (
          <p className="text-zinc-700">{selectedDoc.title}</p>
        ) : (
          <p className="text-zinc-400">Select a document to get started.</p>
        )}
      </main>
    </div>
  );
}
