"use client";

import { useState, useEffect, useCallback } from "react";
import {
  listModels,
  getBookmarkIds,
  addBookmark,
  removeBookmark,
} from "@/lib/api";
import type { HFModel, FilterState } from "@/types";

export function useModels(filters: FilterState) {
  const [models, setModels] = useState<HFModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE = 20;

  const load = useCallback(
    async (reset = false) => {
      setLoading(true);
      setError(null);
      const currentOffset = reset ? 0 : offset;
      try {
        const { models: data } = await listModels({
          search: filters.search,
          pipeline_tag: filters.pipelineTag,
          sort: filters.sort,
          limit: PAGE,
          offset: currentOffset,
        });
        setModels((prev) => (reset ? data : [...prev, ...data]));
        setOffset(currentOffset + data.length);
        setHasMore(data.length === PAGE);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load models");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.search, filters.pipelineTag, filters.sort]
  );

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.pipelineTag, filters.sort]);

  return { models, loading, error, hasMore, loadMore: () => load(false) };
}

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    getBookmarkIds()
      .then((ids) => setBookmarkedIds(new Set(ids)))
      .catch(() => {});
  }, []);

  const toggle = useCallback(async (model: HFModel) => {
    const id = model.modelId;
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        removeBookmark(id).catch(() => {});
      } else {
        next.add(id);
        addBookmark(model).catch(() => {});
      }
      return next;
    });
  }, []);

  return { bookmarkedIds, toggle };
}
