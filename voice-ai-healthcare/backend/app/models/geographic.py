from sqlalchemy import Column, String, Integer, DateTime, Numeric, func
from sqlalchemy.dialects.postgresql import JSONB
from app.core.database import Base


class GeographicProfile(Base):
    __tablename__ = "geographic_profiles"

    zip_code = Column(String(10), primary_key=True)
    county_fips = Column(String(5))
    county_name = Column(String(100))
    state = Column(String(2), index=True)
    urban_rural_classification = Column(String(20))  # rural, urban, suburban
    sdoh_factors = Column(JSONB)  # {transportation: 40, health_literacy: 60, ...}
    disease_prevalence = Column(JSONB)  # {diabetes: 0.12, hypertension: 0.28, ...}
    provider_count = Column(Integer)
    nearest_pharmacy_miles = Column(Numeric(10, 2))
    demographics = Column(JSONB)  # {median_income: 45000, population: 12000, ...}
    last_updated = Column(DateTime(timezone=True), server_default=func.now())
