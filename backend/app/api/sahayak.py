from fastapi import APIRouter
from pydantic import BaseModel
import random
from typing import List

router = APIRouter()

class VolunteerRequest(BaseModel):
    village_id: int
    skill_needed: str = "rescue"

@router.post("/assign-volunteers")
async def assign_volunteers(request: VolunteerRequest):
    random.seed(request.village_id)
    skills = ["medical", "rescue", "logistics", "communication", "shelter"]
    volunteers = []
    
    for i in range(random.randint(3, 6)):
        volunteers.append({
            "volunteer_id": 1000 + i,
            "name": f"Volunteer_{i+1}",
            "skills": random.sample(skills, random.randint(1, 3)),
            "availability": random.choice([True, True, False]),
            "assigned_to": request.skill_needed if random.random() > 0.5 else "standby"
        })
    
    return {
        "volunteers": volunteers,
        "total_available": sum(1 for v in volunteers if v["availability"])
    }