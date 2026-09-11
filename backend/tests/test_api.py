import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))
from app.main import app

client = TestClient(app)

def test_health():
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"

def test_villages():
    r = client.get("/api/v1/villages")
    assert r.status_code == 200
    assert len(r.json()) > 0

def test_predict():
    r = client.post("/api/v1/predict", json={"village_id": 1, "horizon": 24})
    assert r.status_code == 200
    data = r.json()
    assert "flood_probability" in data
    assert "flood_severity" in data
    assert "confidence_lower" in data

def test_route():
    r = client.post("/api/v1/route", json={"village_id": 1, "shelter_id": 1})
    assert r.status_code == 200
    assert "safe_route" in r.json()

def test_rescue():
    r = client.post("/api/v1/assign", json={"village_id": 1})
    assert r.status_code == 200
    assert "assigned_teams" in r.json()

def test_relief():
    r = client.post("/api/v1/allocate", json={"village_id": 1, "affected_population": 1000})
    assert r.status_code == 200
    assert "food_packets" in r.json()

def test_dashboard():
    r = client.get("/api/v1/dashboard")
    assert r.status_code == 200
    assert "total_villages" in r.json()

def test_alert():
    r = client.post("/api/v1/generate", json={"village_id": 1, "risk_level": "high", "language": "english"})
    assert r.status_code == 200
    assert "message" in r.json()

def test_simulate():
    r = client.post("/api/v1/simulate", json={"rainfall_mm": 60.0, "duration_hrs": 48, "river_level_m": 7.5, "district": "Barpeta"})
    assert r.status_code == 200
    assert "projected_risk" in r.json()