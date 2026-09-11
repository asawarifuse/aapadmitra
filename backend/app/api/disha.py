from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

class SimulateRequest(BaseModel):
    rainfall_mm: float = 60.0
    duration_hrs: int = 48
    river_level_m: float = 7.5
    district: str = "Barpeta"

@router.post("/simulate")
async def simulate(request: SimulateRequest):
    random.seed(hash(request.district) % 10000 + int(request.rainfall_mm))
    
    risk = (request.rainfall_mm / 100) * 0.4 + (request.river_level_m / 10) * 0.4
    risk += (request.duration_hrs / 72) * 0.2
    risk = min(1.0, risk)
    
    if risk < 0.3:
        level = "low"
    elif risk < 0.6:
        level = "medium"
    elif risk < 0.8:
        level = "high"
    else:
        level = "extreme"
    
    return {
        "scenario_id": f"SIM_{random.randint(1000, 9999)}",
        "projected_risk": round(risk, 3),
        "risk_level": level,
        "predicted_depth_m": round(risk * 5.0, 2),
        "affected_villages": int(risk * random.randint(10, 50)),
        "recommended_actions": {
            "evacuation": "Recommended" if risk > 0.5 else "Standby",
            "rescue_teams": f"{int(risk * 10)} teams needed",
            "relief_supplies": f"{int(risk * 5000)} food packets",
            "shelters": f"{int(risk * 20)} shelters to prepare"
        }
    }