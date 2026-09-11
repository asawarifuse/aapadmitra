from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard():
    random.seed(42)
    
    return {
        "total_villages": 313,
        "high_risk_villages": random.randint(15, 45),
        "active_alerts": random.randint(5, 15),
        "rescue_teams_deployed": random.randint(5, 20),
        "shelters_occupied": random.randint(100, 500),
        "shelters_capacity": 800,
        "relief_supplies": {
            "food_packets": random.randint(10000, 50000),
            "water_units": random.randint(20000, 100000),
            "medical_kits": random.randint(1000, 5000),
            "tarpaulins": random.randint(500, 2000)
        },
        "severity_distribution": [
            {"name": "Low", "value": random.randint(30, 50)},
            {"name": "Medium", "value": random.randint(20, 35)},
            {"name": "High", "value": random.randint(10, 20)},
            {"name": "Extreme", "value": random.randint(5, 15)}
        ],
        "recent_alerts": [
            {"time": "10:30 AM", "village": "Village_1", "severity": "high", "status": "active"},
            {"time": "09:45 AM", "village": "Village_5", "severity": "extreme", "status": "active"},
            {"time": "08:15 AM", "village": "Village_12", "severity": "medium", "status": "resolved"},
            {"time": "07:00 AM", "village": "Village_8", "severity": "low", "status": "resolved"}
        ],
        "weekly_trend": [
            {"day": "Mon", "alerts": 5, "rescues": 3},
            {"day": "Tue", "alerts": 8, "rescues": 5},
            {"day": "Wed", "alerts": 12, "rescues": 7},
            {"day": "Thu", "alerts": 15, "rescues": 10},
            {"day": "Fri", "alerts": 10, "rescues": 8},
            {"day": "Sat", "alerts": 6, "rescues": 4},
            {"day": "Sun", "alerts": 4, "rescues": 2}
        ]
    }