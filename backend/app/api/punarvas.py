from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

class DamageRequest(BaseModel):
    village_id: int
    estimated_damage: str = "medium"

@router.post("/assess")
async def assess_damage(request: DamageRequest):
    random.seed(request.village_id)
    
    homes_damaged = random.randint(50, 500)
    homes_destroyed = random.randint(10, homes_damaged // 3)
    
    return {
        "village_id": request.village_id,
        "homes_damaged": homes_damaged,
        "homes_destroyed": homes_destroyed,
        "infrastructure_damaged": random.choice(["roads", "bridges", "schools", "multiple"]),
        "aid_provided": random.randint(10000, 100000),
        "recovery_status": random.choice(["just_started", "in_progress", "mostly_complete"]),
        "estimated_recovery_days": random.randint(7, 90)
    }