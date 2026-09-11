from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import sanket, marg, sahay, rahat, smriti, setucore, chetna, sahayak, awaaz, punarvas, disha, drishti

app = FastAPI(
    title="Aapadmitra API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all 12 routers
app.include_router(sanket.router, prefix="/api/v1", tags=["Sanket"])
app.include_router(marg.router, prefix="/api/v1", tags=["Marg"])
app.include_router(sahay.router, prefix="/api/v1", tags=["Sahay"])
app.include_router(rahat.router, prefix="/api/v1", tags=["Rahat"])
app.include_router(smriti.router, prefix="/api/v1", tags=["Smriti"])
app.include_router(setucore.router, prefix="/api/v1", tags=["SetuCore"])
app.include_router(chetna.router, prefix="/api/v1", tags=["Chetna"])
app.include_router(sahayak.router, prefix="/api/v1", tags=["Sahayak"])
app.include_router(awaaz.router, prefix="/api/v1", tags=["Awaaz"])
app.include_router(punarvas.router, prefix="/api/v1", tags=["Punarvas"])
app.include_router(disha.router, prefix="/api/v1", tags=["Disha"])
app.include_router(drishti.router, prefix="/api/v1", tags=["Drishti"])

@app.get("/")
def root():
    return {"project": "Aapadmitra", "status": "running", "modules": 12}

@app.get("/api/v1/health")
def health():
    return {"status": "healthy", "modules": 12}