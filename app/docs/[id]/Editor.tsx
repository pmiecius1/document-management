"use client";

import { useState, useEffect, useRef } from "react";
import db from "@/lib/db";

interface Props {
  id: number;
}

export default function Editor({ id }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    initialized.current = false;
    db.documents.get(id).then((doc) => {
      if (doc) {
        setTitle(doc.title);
        setContent(doc.content);
      }
      initialized.current = true;
    });
  }, [id]);

  useEffect(() => {
    if (!initialized.current) return;
    const timer = setTimeout(async () => {
      await db.documents.update(id, { title, content, updatedAt: Date.now() });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 500);
    return () => clearTimeout(timer);
  }, [title, content, id]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-200 px-8 py-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="flex-1 bg-transparent text-xl font-semibold text-zinc-900 placeholder-zinc-300 outline-none"
        />
        <span
          className={`ml-4 text-xs text-zinc-400 transition-opacity duration-300 ${saved ? "opacity-100" : "opacity-0"}`}
        >
          Saved
        </span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing…"
        className="flex-1 resize-none px-8 py-6 text-sm leading-relaxed text-zinc-700 placeholder-zinc-300 outline-none"
      />
    </div>
  );
}
