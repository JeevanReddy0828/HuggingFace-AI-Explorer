from flask import Blueprint, request, jsonify
from app.services.huggingface import search_models, get_model

models_bp = Blueprint("models", __name__)


@models_bp.get("/")
def list_models():
    search = request.args.get("search", "")
    pipeline_tag = request.args.get("pipeline_tag", "")
    sort = request.args.get("sort", "downloads")
    limit = min(int(request.args.get("limit", 20)), 100)
    offset = int(request.args.get("offset", 0))

    models = search_models(
        search=search,
        pipeline_tag=pipeline_tag,
        sort=sort,
        limit=limit,
        offset=offset,
    )
    return jsonify({"models": models, "total": len(models)})


@models_bp.get("/<path:model_id>")
def model_detail(model_id: str):
    model = get_model(model_id)
    return jsonify(model)
