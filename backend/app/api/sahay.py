from fastapi import APIRouter
from pydantic import BaseModel
import random
from typing import List

router = APIRouter()

class RescueRequest(BaseModel):
    village_id: int

@router.post("/assign")
async def assign_rescue(request: RescueRequest):
    np_seed = request.village_id
    random.seed(np_seed)
    
    num_teams = random.randint(1, 3)
    teams = []
    total_boats = 0
    total_capacity = 0
    
    for i in range(num_teams):
        boats = random.randint(2, 5)
        capacity = boats * 6
        total_boats += boats
        total_capacity += capacity
        
        teams.append({
            "team_id": 100 + i,
            "team_name": f"Team-{chr(65+i)}",
            "distance_km": round(random.uniform(2, 15), 1),
            "boat_count": boats,
            "capacity": capacity,
            "eta_minutes": random.randint(15, 60)
        })
    
    return {
        "village_id": request.village_id,
        "assigned_teams": teams,
        "total_boats": total_boats,
        "total_capacity": total_capacity,
        "estimated_arrival_minutes": max([t["eta_minutes"] for t in teams]) if teams else 0
    }