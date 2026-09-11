from fastapi import APIRouter
from pydantic import BaseModel
import random
from datetime import datetime

router = APIRouter()

class AlertRequest(BaseModel):
    village_id: int
    risk_level: str = "high"
    language: str = "english"

@router.post("/generate")
async def generate_alert(request: AlertRequest):
    templates = {
        "english": {
            "low": "⚠️ Advisory: Flood risk is low. Stay informed.",
            "medium": "⚠️ Watch: Flood risk is medium. Prepare for evacuation.",
            "high": "🚨 Warning: Flood risk is high. Evacuate immediately!",
            "extreme": "🚨 EXTREME: Severe flooding expected. Seek high ground NOW!"
        },
        "hindi": {
            "low": "⚠️ सलाह: बाढ़ का खतरा कम है।",
            "medium": "⚠️ निगरानी: बाढ़ का खतरा मध्यम है।",
            "high": "🚨 चेतावनी: बाढ़ का खतरा अधिक है।",
            "extreme": "🚨 अत्यंत: गंभीर बाढ़ की आशंका।"
        },
        "assamese": {
            "low": "⚠️ পৰামৰ্শ: বানপানীৰ বিপদ কম।",
            "medium": "⚠️ চকু ৰাখক: বানপানীৰ বিপদ মধ্যমীয়া।",
            "high": "🚨 সতৰ্কতা: বানপানীৰ বিপদ বেছি।",
            "extreme": "🚨 চৰম: গুৰুতৰ বানপানী আশংকা।"
        }
    }
    
    msg = templates.get(request.language, templates["english"]).get(request.risk_level, "⚠️ Alert")
    
    return {
        "alert_id": random.randint(10000, 99999),
        "message": msg,
        "language": request.language,
        "delivery_status": random.choice(["sent", "delivered", "pending"]),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }