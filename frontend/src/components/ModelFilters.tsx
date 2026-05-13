"use client";

import { useState, useTransition } from "react";
import type { FilterState, SortField } from "@/types";
import { Search } from "lucide-react";

const PIPELINE_TAGS = [
  { value: "", label: "All tasks" },
  { value: "text-generation", label: "Text Generation" },
  { value: "text-classification", label: "Text Classification" },
  { value: "image-classification", label: "Image Classification" },
  { value: "object-detection", label: "Object Detection" },
  { value: "automatic-speech-recognition", label: "Speech Recognition" },
  { value: "translation", label: "Translation" },
  { value: "summarization", label: "Summarization" },
  { value: "question-answering", label: "Question Answering" },
  { value: "fill-mask", label: "Fill Mask" },
  { value: "feature-extraction", label: "Feature Extraction" },
  { value: "text-to-image", label: "Text to Image" },
];

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "downloads", label: "Downloads" },
  { value: "likes", label: "Likes" },
  { value: "lastModified", label: "Last Modified" },
];

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

export default function ModelFilters({ filters, onChange }: Props) {
  const [search, setSearch] = useState(filters.search);
  const [, startTransition] = useTransition();

  const commit = (partial: Partial<FilterState>) =>
    onChange({ ...filters, ...partial });

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-48">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          placeholder="Search models…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            startTransition(() => commit({ search: e.target.value }));
          }}
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-hf-yellow"
        />
      </div>

      <select
        value={filters.pipelineTag}
        onChange={(e) => commit({ pipelineTag: e.target.value })}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hf-yellow"
      >
        {PIPELINE_TAGS.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={(e) => commit({ sort: e.target.value as SortField })}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hf-yellow"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            Sort: {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
