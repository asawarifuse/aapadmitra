from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class IncidentRequest(BaseModel):
    village_id: int
    rainfall_mm: float = 35.0
    water_level_m: float = 5.5
    road_status: str = "normal"

@router.post("/update")
async def update_incident(request: IncidentRequest):
    risk = (request.rainfall_mm / 100) * 0.4 + (request.water_level_m / 10) * 0.6
    risk = min(1.0, risk)
    
    if risk < 0.3:
        level = "low"
        alert = False
    elif risk < 0.6:
        level = "medium"
        alert = True
    elif risk < 0.8:
        level = "high"
        alert = True
    else:
        level = "extreme"
        alert = True
    
    if request.road_status == "flooded":
        route = "Use boat-based evacuation only"
    else:
        route = "Use standard evacuation route"
    
    return {
        "risk_score": round(risk, 3),
        "risk_level": level,
        "alert_triggered": alert,
        "route_recommendation": route,
        "rescue_priority": "URGENT" if risk > 0.7 else "HIGH" if risk > 0.5 else "MEDIUM",
        "relief_allocation": {
            "food_packets": int(100 * (1 + risk * 2)),
            "water_units": int(200 * (1 + risk * 2)),
            "boats_required": max(1, int(risk * 5))
        }
    }