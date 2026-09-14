from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api import (
    sanket, marg, sahay, rahat, smriti, setucore,
    chetna, sahayak, awaaz, punarvas, disha, drishti
)

app = FastAPI(
    title="Aapadmitra API",
    version="1.0.0",
    description="Aapadmitra: AI-Powered Flood Prediction & Emergency Response System",
)

# ── CORS ──
# Default: allow all (*). For production, set ALLOWED_ORIGINS env var
# (comma-separated, e.g. "https://aapadmitra.vercel.app,http://localhost:5173")
raw_origins = os.environ.get("ALLOWED_ORIGINS", "*")
allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register all 12 routers ──
app.include_router(sanket.router,   prefix="/api/v1", tags=["Sanket"])
app.include_router(marg.router,     prefix="/api/v1", tags=["Marg"])
app.include_router(sahay.router,    prefix="/api/v1", tags=["Sahay"])
app.include_router(rahat.router,    prefix="/api/v1", tags=["Rahat"])
app.include_router(smriti.router,   prefix="/api/v1", tags=["Smriti"])
app.include_router(setucore.router, prefix="/api/v1", tags=["SetuCore"])
app.include_router(chetna.router,   prefix="/api/v1", tags=["Chetna"])
app.include_router(sahayak.router,  prefix="/api/v1", tags=["Sahayak"])
app.include_router(awaaz.router,    prefix="/api/v1", tags=["Awaaz"])
app.include_router(punarvas.router, prefix="/api/v1", tags=["Punarvas"])
app.include_router(disha.router,    prefix="/api/v1", tags=["Disha"])
app.include_router(drishti.router,  prefix="/api/v1", tags=["Drishti"])


@app.get("/")
def root():
    return {
        "project": "Aapadmitra",
        "status": "running",
        "modules": 12,
        "version": "1.0.0",
    }


@app.get("/api/v1/health")
def health():
    return {"status": "healthy", "modules": 12}