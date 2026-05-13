"use client";

import { Bookmark, BookmarkCheck, Download, Heart, GitCompare, ExternalLink } from "lucide-react";
import clsx from "clsx";
import type { HFModel } from "@/types";

interface Props {
  model: HFModel;
  isBookmarked: boolean;
  isComparing: boolean;
  onBookmark: (m: HFModel) => void;
  onCompare: (m: HFModel) => void;
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function ModelCard({
  model,
  isBookmarked,
  isComparing,
  onBookmark,
  onCompare,
}: Props) {
  const [author, ...nameParts] = model.modelId.split("/");
  const name = nameParts.join("/") || author;

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          {nameParts.length > 0 && (
            <p className="truncate text-xs text-gray-400">{author}</p>
          )}
          <a
            href={`https://huggingface.co/${model.modelId}`}
            target="_blank"
            rel="noopener noreferrer"
            title={model.modelId}
            className="group flex items-center gap-1 truncate font-semibold text-gray-900 hover:text-blue-600"
          >
            <span className="truncate">{name}</span>
            <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
          </a>
        </div>

        {model.pipelineTag && (
          <span className="shrink-0 rounded-full bg-hf-yellow/20 px-2 py-0.5 text-xs font-medium text-hf-dark">
            {model.pipelineTag}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between pt-3 text-gray-500">
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            {fmt(model.downloads)}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {fmt(model.likes)}
          </span>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onCompare(model)}
            title="Add to compare"
            className={clsx(
              "rounded p-1.5 transition hover:bg-gray-100",
              isComparing && "text-blue-600"
            )}
          >
            <GitCompare className="h-4 w-4" />
          </button>
          <button
            onClick={() => onBookmark(model)}
            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
            className={clsx(
              "rounded p-1.5 transition hover:bg-gray-100",
              isBookmarked && "text-hf-dark"
            )}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 fill-hf-yellow" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
