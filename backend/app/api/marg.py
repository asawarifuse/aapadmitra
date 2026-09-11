from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
import random
from typing import List

router = APIRouter()

class RouteRequest(BaseModel):
    village_id: int
    shelter_id: int = 1

@router.post("/route")
async def get_route(request: RouteRequest):
    np.random.seed(request.village_id + request.shelter_id)
    
    num_waypoints = random.randint(3, 6)
    route = []
    
    for i in range(num_waypoints):
        route.append({
            "lat": round(24.5 + random.uniform(0, 3), 6),
            "lon": round(89.5 + random.uniform(0, 4), 6),
            "flood_risk": round(random.uniform(0.1, 0.9), 2),
            "road_condition": random.choice(["good", "fair", "poor", "flooded"])
        })
    
    distance = round(random.uniform(5, 25), 1)
    
    return {
        "village_id": request.village_id,
        "shelter_id": request.shelter_id,
        "route_distance_km": distance,
        "estimated_time_min": int(distance * 2.5),
        "flood_risk_score": round(random.uniform(0.1, 0.8), 2),
        "safe_route": route
    }