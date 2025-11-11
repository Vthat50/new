from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine
from app.models import *  # Import all models to register them
from app.api.routes import patients, calls, analytics, integrations, sms
from app.api import triggers, marketing, outcomes

app = FastAPI(
    title="Voice AI Healthcare Platform",
    description="Data-driven intelligence platform for patient engagement",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(patients.router)
app.include_router(calls.router)
app.include_router(analytics.router)
app.include_router(integrations.router)
app.include_router(sms.router)
app.include_router(triggers.router, prefix="/api/triggers", tags=["Triggers"])
app.include_router(marketing.router, prefix="/api/marketing", tags=["Marketing"])
app.include_router(outcomes.router, prefix="/api/outcomes", tags=["Outcomes"])


@app.get("/")
def root():
    return {
        "message": "Voice AI Healthcare Platform API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/api/init-data")
def initialize_mock_data():
    """Initialize database with mock data"""
    from app.core.database import SessionLocal
    from app.services.mock_data import populate_all_mock_data

    db = SessionLocal()
    try:
        populate_all_mock_data(db)
        return {"message": "Mock data initialized successfully"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
