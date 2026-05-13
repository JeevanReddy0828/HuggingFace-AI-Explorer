"use client";

import { useEffect, useState } from "react";
import { listBookmarks, removeBookmark } from "@/lib/api";
import type { Bookmark } from "@/types";
import { Loader2, Trash2, Download, Heart, ExternalLink } from "lucide-react";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listBookmarks()
      .then(setBookmarks)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (modelId: string) => {
    await removeBookmark(modelId);
    setBookmarks((prev) => prev.filter((b) => b.modelId !== modelId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <p className="text-sm text-gray-500 mt-1">
          {bookmarks.length} saved model{bookmarks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && bookmarks.length === 0 && (
        <p className="py-12 text-center text-gray-400">
          No bookmarks yet. Browse models and click the bookmark icon.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs text-gray-400">{b.author}</p>
                <a
                  href={`https://huggingface.co/${b.modelId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={b.modelId}
                  className="group flex items-center gap-1 truncate font-semibold text-gray-900 hover:text-blue-600"
                >
                  <span className="truncate">{b.modelId.split("/").pop() ?? b.modelId}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
                </a>
              </div>
              {b.pipelineTag && (
                <span className="shrink-0 rounded-full bg-hf-yellow/20 px-2 py-0.5 text-xs font-medium text-hf-dark">
                  {b.pipelineTag}
                </span>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between pt-3 text-gray-500">
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <Download className="h-3.5 w-3.5" />
                  {fmt(b.downloads)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {fmt(b.likes)}
                </span>
              </div>
              <button
                onClick={() => handleRemove(b.modelId)}
                className="rounded p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
