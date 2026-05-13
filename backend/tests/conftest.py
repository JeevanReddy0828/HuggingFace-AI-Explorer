import pytest
from app import create_app, db as _db


@pytest.fixture(scope="session")
def app():
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "postgresql://postgres:postgres@localhost:5432/hf_explorer_test"
    )
    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()
