import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import patients, calls, analytics, integrations
from app.api import triggers, marketing, outcomes

app = FastAPI(
    title="Voice AI Healthcare Platform",
    description="Data-driven intelligence platform for patient engagement",
    version="1.0.0"
)

# CORS middleware - Allow all origins for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(patients.router)
app.include_router(calls.router)
app.include_router(analytics.router)
app.include_router(integrations.router)
app.include_router(triggers.router, prefix="/api/triggers", tags=["Triggers"])
app.include_router(marketing.router, prefix="/api/marketing", tags=["Marketing"])
app.include_router(outcomes.router, prefix="/api/outcomes", tags=["Outcomes"])


@app.get("/")
def root():
    return {
        "message": "Voice AI Healthcare Platform API on Vercel",
        "version": "1.0.0",
        "status": "running",
        "platform": "vercel"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "platform": "vercel"}


@app.get("/api/health")
def api_health_check():
    """Health check endpoint at /api/health"""
    return {"status": "healthy", "platform": "vercel", "path": "/api/health"}
