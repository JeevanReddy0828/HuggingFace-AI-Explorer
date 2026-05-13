from datetime import datetime, timezone
from app import db


class Bookmark(db.Model):
    __tablename__ = "bookmarks"

    id = db.Column(db.Integer, primary_key=True)
    model_id = db.Column(db.String(256), nullable=False, unique=True, index=True)
    model_name = db.Column(db.String(256), nullable=False)
    author = db.Column(db.String(128))
    pipeline_tag = db.Column(db.String(64))
    downloads = db.Column(db.BigInteger, default=0)
    likes = db.Column(db.Integer, default=0)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "modelId": self.model_id,
            "modelName": self.model_name,
            "author": self.author,
            "pipelineTag": self.pipeline_tag,
            "downloads": self.downloads,
            "likes": self.likes,
            "createdAt": self.created_at.isoformat(),
        }
