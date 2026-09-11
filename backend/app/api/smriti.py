from fastapi import APIRouter
from pydantic import BaseModel
import random
from typing import List

router = APIRouter()

class SimilarityRequest(BaseModel):
    district: str
    rainfall_mm: float = 45.0
    water_level_m: float = 6.0

@router.post("/similar")
async def find_similar(request: SimilarityRequest):
    random.seed(hash(request.district) % 10000)
    
    num_events = random.randint(3, 5)
    events = []
    
    for i in range(num_events):
        events.append({
            "event_id": 100 + i,
            "year": random.randint(2015, 2025),
            "district": request.district,
            "severity": random.choice(["low", "medium", "high", "extreme"]),
            "villages_affected": random.randint(5, 50),
            "population_affected": random.randint(500, 50000)
        })
    
    recommendations = [
        "Strengthen embankments in low-lying areas",
        "Pre-position rescue boats and life jackets",
        "Ensure adequate food and water supplies",
        "Set up temporary shelters in elevated areas"
    ]
    
    return {
        "similar_events": events,
        "recommendation": random.choice(recommendations)
    }