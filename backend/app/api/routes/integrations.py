from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.api.dependencies import get_db
from app.models.integration import DataIntegration

router = APIRouter(prefix="/api/integrations", tags=["integrations"])


@router.get("/")
def get_integrations(db: Session = Depends(get_db)):
    """Get all data integration statuses"""
    integrations = db.query(DataIntegration).all()

    return [
        {
            "id": str(integration.id),
            "source_name": integration.source_name,
            "source_type": integration.source_type,
            "sync_status": integration.sync_status,
            "last_sync": integration.last_sync,
            "record_count": integration.record_count,
            "error_log": integration.error_log,
            "config": integration.config
        }
        for integration in integrations
    ]


@router.get("/health")
def get_integration_health(db: Session = Depends(get_db)):
    """Get overall integration health metrics"""
    integrations = db.query(DataIntegration).all()

    total = len(integrations)
    connected = len([i for i in integrations if i.sync_status == "success"])
    failed = len([i for i in integrations if i.sync_status == "failed"])
    in_progress = len([i for i in integrations if i.sync_status == "in_progress"])

    return {
        "total_sources": total,
        "connected": connected,
        "failed": failed,
        "in_progress": in_progress,
        "health_percentage": round((connected / total) * 100, 1) if total > 0 else 0,
        "last_updated": datetime.now()
    }
