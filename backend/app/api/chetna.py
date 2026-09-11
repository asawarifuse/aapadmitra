from fastapi import APIRouter
from pydantic import BaseModel
import random
from datetime import datetime

router = APIRouter()

class ReportRequest(BaseModel):
    village_id: int
    description: str = "Water level rising"
    location_lat: float = 26.5
    location_lon: float = 91.5

@router.post("/submit")
async def submit_report(request: ReportRequest):
    random.seed(request.village_id)
    severity = random.choice(["low", "medium", "high", "extreme"])
    verified = random.choice([True, False])
    
    return {
        "report_id": random.randint(1000, 9999),
        "village_id": request.village_id,
        "severity": severity,
        "verified": verified,
        "resolution_status": "pending" if not verified else "in_progress",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }