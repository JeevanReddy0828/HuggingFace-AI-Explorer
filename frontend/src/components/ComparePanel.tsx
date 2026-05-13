"use client";

import { X } from "lucide-react";
import type { HFModel } from "@/types";

interface Props {
  models: HFModel[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const ROWS: { key: keyof HFModel; label: string }[] = [
  { key: "pipelineTag", label: "Task" },
  { key: "downloads", label: "Downloads" },
  { key: "likes", label: "Likes" },
  { key: "lastModified", label: "Last Modified" },
];

function fmt(v: unknown): string {
  if (v == null || v === "") return "—";
  if (typeof v === "number") {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
    return String(v);
  }
  if (typeof v === "string" && v.includes("T")) {
    return new Date(v).toLocaleDateString();
  }
  return String(v);
}

export default function ComparePanel({ models, onRemove, onClear }: Props) {
  if (models.length === 0) return null;

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-blue-900">
          Comparing {models.length} model{models.length > 1 ? "s" : ""}
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-blue-600 hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-28 pr-4 text-left text-gray-500 font-normal" />
              {models.map((m) => (
                <th key={m.modelId} className="px-3 py-1 text-left font-medium">
                  <div className="flex items-center gap-1">
                    <span className="truncate max-w-[140px]" title={m.modelId}>
                      {m.modelId.split("/").pop()}
                    </span>
                    <button
                      onClick={() => onRemove(m.modelId)}
                      className="shrink-0 text-gray-400 hover:text-gray-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(({ key, label }) => (
              <tr key={key} className="border-t border-blue-100">
                <td className="py-2 pr-4 text-gray-500">{label}</td>
                {models.map((m) => (
                  <td key={m.modelId} className="px-3 py-2">
                    {fmt(m[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
