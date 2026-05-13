import os
import requests

HF_API_BASE = "https://huggingface.co/api"
HF_TOKEN = os.getenv("HF_TOKEN", "")

HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}


def search_models(
    search: str = "",
    pipeline_tag: str = "",
    sort: str = "downloads",
    limit: int = 20,
    offset: int = 0,
):
    params = {
        "limit": limit,
        "full": "true",
        "config": "true",
    }
    if search:
        params["search"] = search
    if pipeline_tag:
        params["pipeline_tag"] = pipeline_tag
    if sort:
        params["sort"] = sort

    # HuggingFace API uses direction for sort order
    params["direction"] = -1

    resp = requests.get(
        f"{HF_API_BASE}/models",
        params=params,
        headers=HEADERS,
        timeout=15,
    )
    resp.raise_for_status()
    raw = resp.json()

    # Paginate client-side since HF API cursor-based pagination is opaque
    page_items = raw[offset : offset + limit]
    return [_normalize(m) for m in page_items]


def get_model(model_id: str):
    resp = requests.get(
        f"{HF_API_BASE}/models/{model_id}",
        headers=HEADERS,
        timeout=15,
    )
    resp.raise_for_status()
    return _normalize(resp.json())


def _normalize(m: dict) -> dict:
    return {
        "modelId": m.get("modelId") or m.get("id", ""),
        "author": m.get("author", ""),
        "pipelineTag": m.get("pipeline_tag", ""),
        "downloads": m.get("downloads", 0),
        "likes": m.get("likes", 0),
        "lastModified": m.get("lastModified", ""),
        "tags": m.get("tags", []),
        "cardData": m.get("cardData", {}),
        "siblings": [s.get("rfilename") for s in m.get("siblings", [])],
    }
