export interface HFModel {
  modelId: string;
  author: string;
  pipelineTag: string;
  downloads: number;
  likes: number;
  lastModified: string;
  tags: string[];
  cardData: Record<string, unknown>;
  siblings: string[];
}

export interface Bookmark {
  id: number;
  modelId: string;
  modelName: string;
  author: string;
  pipelineTag: string;
  downloads: number;
  likes: number;
  createdAt: string;
}

export type SortField = "downloads" | "likes" | "lastModified";

export interface FilterState {
  search: string;
  pipelineTag: string;
  sort: SortField;
}
