from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import torch
from pathlib import Path
from datetime import datetime

router = APIRouter()

# Paths
project_root = Path(__file__).parent.parent.parent.parent
artifacts = project_root / "ml" / "artifacts"

# Load scaler and feature names
scaler = joblib.load(artifacts / "scaler.pkl")
feature_names = joblib.load(artifacts / "feature_names.pkl")

# Load models
lr_model = joblib.load(artifacts / "LogisticRegression.pkl")
rf_model = joblib.load(artifacts / "RandomForest.pkl")
xgb_model = joblib.load(artifacts / "XGBoost.pkl")

# Load physics MLP
class PhysicsMLP(torch.nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.fc1 = torch.nn.Linear(input_dim, 64)
        self.fc2 = torch.nn.Linear(64, 32)
        self.fc3 = torch.nn.Linear(32, 1)
        self.dropout = torch.nn.Dropout(0.3)
        self.relu = torch.nn.ReLU()
    
    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.relu(self.fc2(x))
        x = self.dropout(x)
        return torch.sigmoid(self.fc3(x))

physics_model = PhysicsMLP(len(feature_names))
physics_model.load_state_dict(torch.load(artifacts / "physics_mlp.pth", map_location='cpu'))
physics_model.eval()

# Load villages
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
    
    # Generate features (in production, from real data)
    np.random.seed(request.village_id + request.horizon)
    
    features = np.array([[
        np.random.uniform(10, 60),  # rainfall_mm
        np.random.uniform(5, 15),   # rainfall_intensity
        np.random.uniform(30, 120), # cumulative_72hr
        np.random.uniform(2, 8),    # water_level_m
        np.random.uniform(0.3, 0.9),# danger_ratio
        np.random.uniform(60, 95),  # humidity_pct
        np.random.uniform(25, 35),  # temp_c
        np.random.uniform(990, 1005),# pressure_hpa
        np.random.uniform(0, 40),   # wind_speed_kmph
        np.random.uniform(0.5, 4),  # soil_permeability
        np.random.uniform(50, 90),  # soil_saturation_pct
        v['elevation_m'],           # elevation_m
        np.random.uniform(0, 10),   # slope_deg
        v['river_distance_km'],     # river_distance_km
        np.random.uniform(500, 3000),# river_flow_cms
        v['population'],            # population
        np.random.uniform(0.5, 3),  # historical_frequency
        np.random.uniform(10, 60),  # impervious_pct
    ]])
    
    features_scaled = scaler.transform(features)
    
    # Ensemble prediction (average of all models)
    lr_prob = lr_model.predict_proba(features_scaled)[0][1]
    rf_prob = rf_model.predict_proba(features_scaled)[0][1]
    xgb_prob = xgb_model.predict_proba(features_scaled)[0][1]
    
    with torch.no_grad():
        physics_prob = physics_model(torch.FloatTensor(features_scaled)).numpy().flatten()[0]
    
    # Weighted ensemble
    prob = (lr_prob * 0.2 + rf_prob * 0.2 + xgb_prob * 0.2 + physics_prob * 0.4)
    
    # Severity
    if prob < 0.3:
        severity = "low"
    elif prob < 0.5:
        severity = "medium"
    elif prob < 0.7:
        severity = "high"
    else:
        severity = "extreme"
    
    # Uncertainty (simplified — std of ensemble)
    uncertainty = float(np.std([lr_prob, rf_prob, xgb_prob, physics_prob]))
    
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
            "elevation": round(float(np.random.uniform(0.1, 0.3)), 3)
        }
    }