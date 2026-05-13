import sentry_sdk
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sentry_sdk.integrations.flask import FlaskIntegration

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    import os

    sentry_dsn = os.getenv("SENTRY_DSN")
    if sentry_dsn:
        sentry_sdk.init(
            dsn=sentry_dsn,
            integrations=[FlaskIntegration()],
            traces_sample_rate=1.0,
        )

    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "postgresql://postgres:postgres@db:5432/hf_explorer"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app, origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","))

    db.init_app(app)
    migrate.init_app(app, db)

    from app.routes.models import models_bp
    from app.routes.bookmarks import bookmarks_bp

    app.register_blueprint(models_bp, url_prefix="/api/models")
    app.register_blueprint(bookmarks_bp, url_prefix="/api/bookmarks")

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app
