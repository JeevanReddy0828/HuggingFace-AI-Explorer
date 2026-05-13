from flask import Blueprint, request, jsonify, abort
from app import db
from app.models import Bookmark

bookmarks_bp = Blueprint("bookmarks", __name__)


@bookmarks_bp.get("/")
def list_bookmarks():
    items = Bookmark.query.order_by(Bookmark.created_at.desc()).all()
    return jsonify([b.to_dict() for b in items])


@bookmarks_bp.post("/")
def add_bookmark():
    data = request.get_json(force=True)
    model_id = data.get("modelId")
    if not model_id:
        abort(400, "modelId is required")

    existing = Bookmark.query.filter_by(model_id=model_id).first()
    if existing:
        return jsonify(existing.to_dict()), 200

    bookmark = Bookmark(
        model_id=model_id,
        model_name=data.get("modelName", model_id),
        author=data.get("author", ""),
        pipeline_tag=data.get("pipelineTag", ""),
        downloads=data.get("downloads", 0),
        likes=data.get("likes", 0),
    )
    db.session.add(bookmark)
    db.session.commit()
    return jsonify(bookmark.to_dict()), 201


@bookmarks_bp.delete("/<path:model_id>")
def remove_bookmark(model_id: str):
    bookmark = Bookmark.query.filter_by(model_id=model_id).first_or_404()
    db.session.delete(bookmark)
    db.session.commit()
    return "", 204


@bookmarks_bp.get("/ids")
def bookmark_ids():
    ids = [b.model_id for b in Bookmark.query.with_entities(Bookmark.model_id).all()]
    return jsonify(ids)
