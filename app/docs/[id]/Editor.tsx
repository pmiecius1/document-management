"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import db from "@/lib/db";

interface Props {
  id: number;
}

export default function Editor({ id }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const initialized = useRef(false);

  useEffect(() => {
    initialized.current = false;
    setNotFound(false);
    db.documents.get(id).then((doc) => {
      if (doc) {
        setTitle(doc.title);
        setContent(doc.content);
      } else {
        setNotFound(true);
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

  if (notFound) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3">
        <p className="text-sm font-medium text-zinc-700">Document not found.</p>
        <Link href="/docs" className="text-sm text-zinc-400 underline hover:text-zinc-600">
          Back to workspace
        </Link>
      </main>
    );
  }

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
        <div className="ml-4 flex items-center gap-3">
          <span
            className={`text-xs text-zinc-400 transition-opacity duration-300 ${saved ? "opacity-100" : "opacity-0"}`}
          >
            Saved
          </span>
          <div className="flex rounded-md border border-zinc-200 text-xs font-medium">
            <button
              onClick={() => setMode("edit")}
              className={`px-3 py-1.5 transition-colors ${
                mode === "edit"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:text-zinc-700"
              } rounded-l-md`}
            >
              Edit
            </button>
            <button
              onClick={() => setMode("preview")}
              className={`px-3 py-1.5 transition-colors ${
                mode === "preview"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:text-zinc-700"
              } rounded-r-md`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {mode === "edit" ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={"Start writing… (Markdown supported)\n\n# Heading\n**bold**  _italic_\n- bullet"}
          className="flex-1 resize-none px-8 py-6 font-mono text-sm leading-relaxed text-zinc-700 placeholder-zinc-300 outline-none"
        />
      ) : (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {content.trim() ? (
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="mb-4 mt-6 text-2xl font-semibold text-zinc-900 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="mb-3 mt-5 text-xl font-semibold text-zinc-900 first:mt-0">{children}</h2>,
                h3: ({ children }) => <h3 className="mb-2 mt-4 text-lg font-semibold text-zinc-900 first:mt-0">{children}</h3>,
                p: ({ children }) => <p className="mb-3 text-sm leading-relaxed text-zinc-700">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-zinc-900">{children}</strong>,
                em: ({ children }) => <em className="italic text-zinc-700">{children}</em>,
                ul: ({ children }) => <ul className="mb-3 ml-4 list-disc space-y-1 text-sm text-zinc-700">{children}</ul>,
                ol: ({ children }) => <ol className="mb-3 ml-4 list-decimal space-y-1 text-sm text-zinc-700">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-sm text-zinc-300">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
