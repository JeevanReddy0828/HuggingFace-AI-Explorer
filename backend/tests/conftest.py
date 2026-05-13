import os
import pytest

os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5432/hf_explorer_test",
)

from app import create_app, db as _db  # noqa: E402


@pytest.fixture(scope="session")
def app():
    app = create_app()
    app.config["TESTING"] = True
    with app.app_context():
        _db.create_all()
        yield app
        _db.session.remove()
        _db.engine.dispose()
        _db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()
