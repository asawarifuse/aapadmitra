from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ReliefRequest(BaseModel):
    village_id: int
    affected_population: int = 1000

@router.post("/allocate")
async def allocate_relief(request: ReliefRequest):
    pop = request.affected_population
    
    return {
        "village_id": request.village_id,
        "food_packets": pop * 3,
        "water_units": pop * 5,
        "medical_kits": int(pop * 0.1),
        "tarpaulins": int(pop * 0.2),
        "blankets": int(pop * 0.3),
        "total_weight_kg": int(pop * 3 * 0.5 + pop * 5 * 1),
        "delivery_vehicles": max(1, int((pop * 3 + pop * 5) / 1000))
    }