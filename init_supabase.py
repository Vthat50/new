#!/usr/bin/env python3
"""
Initialize Supabase database with demo data
Run this script locally: python3 init_supabase.py
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Set Supabase connection
os.environ['DATABASE_URL'] = 'postgresql://postgres:BOAT039draw@db.bvimukqzjjppzqehskzg.supabase.co:5432/postgres'
os.environ['REDIS_URL'] = 'redis://default:ASHOAAImcDI4NmI5Nzc5Mjg4NDI0YmUzOTJhM2FhY2I4NWZkOGZhZnAyODY1NA@notable-jackal-8654.upstash.io:6379'

print("=" * 60)
print("Initializing Supabase Database")
print("=" * 60)

try:
    print("\n1. Importing database modules...")
    from backend.app.core.database import Base, engine, SessionLocal
    from backend.app.models import *  # Import all models

    print("✅ Modules imported successfully")

    print("\n2. Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully")

    print("\n3. Populating with demo data...")
    from backend.app.services.mock_data import populate_all_mock_data

    db = SessionLocal()
    try:
        populate_all_mock_data(db)
        print("✅ Demo data added successfully!")

        # Verify data
        from backend.app.models.patient import Patient
        patient_count = db.query(Patient).count()
        print(f"\n✅ Database initialized with {patient_count} patients")

    finally:
        db.close()

    print("\n" + "=" * 60)
    print("SUCCESS! Your Supabase database is ready!")
    print("=" * 60)
    print("\nYour deployed app will now show demo patients.")
    print(f"Visit: https://voice-ai-healthcare-onkc1ak9g-vthatte1-5467s-projects.vercel.app")

except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\nTroubleshooting:")
    print("1. Make sure you have installed dependencies: cd backend && pip install -r requirements.txt")
    print("2. Check that your Supabase database is running")
    print("3. Verify the connection string is correct")
    import traceback
    traceback.print_exc()
    sys.exit(1)
