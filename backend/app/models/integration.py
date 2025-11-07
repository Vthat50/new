from sqlalchemy import Column, String, Integer, Text, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.core.database import Base
import uuid


class DataIntegration(Base):
    __tablename__ = "data_integrations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_name = Column(String(100), nullable=False, unique=True)
    source_type = Column(String(50))  # api, web_scrape, manual_upload
    api_endpoint = Column(String(500))
    last_sync = Column(DateTime(timezone=True))
    sync_status = Column(String(50), default="pending")  # success, failed, in_progress, pending
    record_count = Column(Integer, default=0)
    error_log = Column(Text)
    config = Column(JSONB)  # {frequency: 'daily', enabled: true, ...}
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
