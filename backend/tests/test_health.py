def test_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.get_json()["status"] == "ok"


def test_bookmarks_empty(client):
    res = client.get("/api/bookmarks/")
    assert res.status_code == 200
    assert res.get_json() == []


def test_bookmark_create_and_delete(client):
    payload = {
        "modelId": "test/model-1",
        "modelName": "test/model-1",
        "author": "test",
        "pipelineTag": "text-generation",
        "downloads": 100,
        "likes": 5,
    }
    res = client.post("/api/bookmarks/", json=payload)
    assert res.status_code == 201
    data = res.get_json()
    assert data["modelId"] == "test/model-1"

    # idempotent re-create
    res2 = client.post("/api/bookmarks/", json=payload)
    assert res2.status_code == 200

    # delete
    res3 = client.delete("/api/bookmarks/test/model-1")
    assert res3.status_code == 204

    # confirm gone
    ids = client.get("/api/bookmarks/ids").get_json()
    assert "test/model-1" not in ids
