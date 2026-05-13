"use client";

import { useState } from "react";
import { getModel } from "@/lib/api";
import type { HFModel } from "@/types";
import ComparePanel from "@/components/ComparePanel";
import { Plus, Loader2 } from "lucide-react";

export default function ComparePage() {
  const [models, setModels] = useState<HFModel[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addModel = async () => {
    const id = input.trim();
    if (!id) return;
    if (models.find((m) => m.modelId === id)) {
      setError("Model already added.");
      return;
    }
    if (models.length >= 4) {
      setError("Maximum 4 models.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const model = await getModel(id);
      setModels((prev) => [...prev, model]);
      setInput("");
    } catch {
      setError(`Could not find model "${id}".`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Compare Models</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add up to 4 models by their HuggingFace ID (e.g.{" "}
          <code className="text-xs">meta-llama/Llama-3.2-1B</code>)
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addModel()}
          placeholder="owner/model-name"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hf-yellow"
        />
        <button
          onClick={addModel}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg bg-hf-yellow px-4 py-2 text-sm font-semibold text-hf-dark hover:bg-yellow-300 disabled:opacity-50 transition"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {models.length === 0 ? (
        <p className="py-12 text-center text-gray-400">
          Add models above to start comparing.
        </p>
      ) : (
        <ComparePanel
          models={models}
          onRemove={(id) => setModels((prev) => prev.filter((m) => m.modelId !== id))}
          onClear={() => setModels([])}
        />
      )}
    </div>
  );
}
