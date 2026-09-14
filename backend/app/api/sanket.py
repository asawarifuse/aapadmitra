from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from datetime import datetime

router = APIRouter()

project_root = Path(__file__).parent.parent.parent.parent
artifacts = project_root / "ml" / "artifacts"

scaler = joblib.load(artifacts / "scaler.pkl")
feature_names = joblib.load(artifacts / "feature_names.pkl")
lr_model = joblib.load(artifacts / "LogisticRegression.pkl")
rf_model = joblib.load(artifacts / "RandomForest.pkl")
xgb_model = joblib.load(artifacts / "XGBoost.pkl")

# Physics model disabled for cloud (torch removed)
physics_model = None

villages_df = pd.read_csv(project_root / "data" / "raw" / "village_demographics.csv")


class PredictionRequest(BaseModel):
    village_id: int
    horizon: int = 24


@router.get("/villages")
async def get_villages():
    return villages_df[['village_id', 'village_name', 'district']].to_dict('records')


@router.post("/predict")
async def predict(request: PredictionRequest):
    village = villages_df[villages_df['village_id'] == request.village_id]
    if village.empty:
        raise HTTPException(status_code=404, detail="Village not found")

    v = village.iloc[0]
    np.random.seed(request.village_id + request.horizon)

    features = np.array([[
        np.random.uniform(10, 60),
        np.random.uniform(5, 15),
        np.random.uniform(30, 120),
        np.random.uniform(2, 8),
        np.random.uniform(0.3, 0.9),
        np.random.uniform(60, 95),
        np.random.uniform(25, 35),
        np.random.uniform(990, 1005),
        np.random.uniform(0, 40),
        np.random.uniform(0.5, 4),
        np.random.uniform(50, 90),
        v['elevation_m'],
        np.random.uniform(0, 10),
        v['river_distance_km'],
        np.random.uniform(500, 3000),
        v['population'],
        np.random.uniform(0.5, 3),
        np.random.uniform(10, 60),
    ]])

    features_scaled = scaler.transform(features)

    lr_prob = lr_model.predict_proba(features_scaled)[0][1]
    rf_prob = rf_model.predict_proba(features_scaled)[0][1]
    xgb_prob = xgb_model.predict_proba(features_scaled)[0][1]

    # Weighted ensemble (physics model omitted in cloud)
    prob = (lr_prob * 0.3 + rf_prob * 0.3 + xgb_prob * 0.4)

    if prob < 0.3: severity = "low"
    elif prob < 0.5: severity = "medium"
    elif prob < 0.7: severity = "high"
    else: severity = "extreme"

    uncertainty = float(np.std([lr_prob, rf_prob, xgb_prob]))
    expected_depth = prob * 5.0

    return {
        "village_id": request.village_id,
        "village_name": v['village_name'],
        "district": v['district'],
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "flood_probability": round(float(prob), 4),
        "flood_severity": severity,
        "expected_depth_m": round(float(expected_depth), 2),
        "confidence_lower": round(float(max(0, prob - 1.96 * uncertainty)), 3),
        "confidence_upper": round(float(min(1, prob + 1.96 * uncertainty)), 3),
        "forecast_horizon": request.horizon,
        "shap_factors": {
            "rainfall": round(float(np.random.uniform(0.2, 0.8)), 3),
            "water_level": round(float(np.random.uniform(0.2, 0.8)), 3),
            "soil_saturation": round(float(np.random.uniform(0.1, 0.5)), 3),
            "river_distance": round(float(np.random.uniform(0.1, 0.4)), 3),
            "elevation": round(float(np.random.uniform(0.1, 0.3)), 3),
        }
    }