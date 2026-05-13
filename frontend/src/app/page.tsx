"use client";

import { useState, useCallback } from "react";
import ModelCard from "@/components/ModelCard";
import ModelFilters from "@/components/ModelFilters";
import ComparePanel from "@/components/ComparePanel";
import { useModels, useBookmarks } from "@/lib/hooks";
import type { FilterState, HFModel } from "@/types";
import { Loader2 } from "lucide-react";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  pipelineTag: "",
  sort: "downloads",
};

export default function BrowsePage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [compareList, setCompareList] = useState<HFModel[]>([]);

  const { models, loading, error, hasMore, loadMore } = useModels(filters);
  const { bookmarkedIds, toggle: toggleBookmark } = useBookmarks();

  const toggleCompare = useCallback((model: HFModel) => {
    setCompareList((prev) => {
      const exists = prev.find((m) => m.modelId === model.modelId);
      if (exists) return prev.filter((m) => m.modelId !== model.modelId);
      if (prev.length >= 4) return prev;
      return [...prev, model];
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Browse AI Models</h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore thousands of models from the HuggingFace Hub
        </p>
      </div>

      <ModelFilters filters={filters} onChange={setFilters} />

      {compareList.length > 0 && (
        <ComparePanel
          models={compareList}
          onRemove={(id) =>
            setCompareList((prev) => prev.filter((m) => m.modelId !== id))
          }
          onClear={() => setCompareList([])}
        />
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {models.map((model) => (
          <ModelCard
            key={model.modelId}
            model={model}
            isBookmarked={bookmarkedIds.has(model.modelId)}
            isComparing={compareList.some((m) => m.modelId === model.modelId)}
            onBookmark={toggleBookmark}
            onCompare={toggleCompare}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && hasMore && models.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="rounded-lg bg-hf-yellow px-6 py-2 text-sm font-semibold text-hf-dark hover:bg-yellow-300 transition"
          >
            Load more
          </button>
        </div>
      )}

      {!loading && models.length === 0 && !error && (
        <p className="py-12 text-center text-gray-400">No models found.</p>
      )}
    </div>
  );
}
