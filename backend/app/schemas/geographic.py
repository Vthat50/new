from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class GeographicProfile(BaseModel):
    zip_code: str
    county_fips: Optional[str] = None
    county_name: Optional[str] = None
    state: Optional[str] = None
    urban_rural_classification: Optional[str] = None
    sdoh_factors: Optional[dict] = None
    disease_prevalence: Optional[dict] = None
    provider_count: Optional[int] = None
    nearest_pharmacy_miles: Optional[float] = None
    demographics: Optional[dict] = None
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True
