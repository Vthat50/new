import os
import sys

# Add backend to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend.app.main import app
from backend.app.core.database import init_db

# Initialize database tables on first load
try:
    init_db()
except Exception as e:
    print(f"Database initialization note: {e}")

# Vercel serverless function handler
handler = app
