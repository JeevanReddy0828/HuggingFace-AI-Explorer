import type { HFModel, Bookmark } from "@/types";

const BASE = "/api";

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ---- Models ----

export async function listModels(params: {
  search?: string;
  pipeline_tag?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}): Promise<{ models: HFModel[]; total: number }> {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.pipeline_tag) qs.set("pipeline_tag", params.pipeline_tag);
  if (params.sort) qs.set("sort", params.sort);
  if (params.limit != null) qs.set("limit", String(params.limit));
  if (params.offset != null) qs.set("offset", String(params.offset));
  return fetchJSON(`${BASE}/models/?${qs}`);
}

export async function getModel(modelId: string): Promise<HFModel> {
  return fetchJSON(`${BASE}/models/${encodeURIComponent(modelId)}`);
}

// ---- Bookmarks ----

export async function listBookmarks(): Promise<Bookmark[]> {
  return fetchJSON(`${BASE}/bookmarks/`);
}

export async function getBookmarkIds(): Promise<string[]> {
  return fetchJSON(`${BASE}/bookmarks/ids`);
}

export async function addBookmark(model: HFModel): Promise<Bookmark> {
  return fetchJSON(`${BASE}/bookmarks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      modelId: model.modelId,
      modelName: model.modelId,
      author: model.author,
      pipelineTag: model.pipelineTag,
      downloads: model.downloads,
      likes: model.likes,
    }),
  });
}

export async function removeBookmark(modelId: string): Promise<void> {
  return fetchJSON(`${BASE}/bookmarks/${encodeURIComponent(modelId)}`, {
    method: "DELETE",
  });
}
