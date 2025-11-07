# Voice AI Healthcare Platform

A comprehensive data-driven intelligence platform for patient engagement that integrates real-time data enrichment through APIs, geographic health intelligence, insurance coverage analysis, and patient assistance program eligibility.

## 🎯 Features

### 1. **Data Integrations**
- Real-time sync with multiple data sources (AHRQ SDOH, CDC WONDER, CMS Medicare, etc.)
- Automated web scraping for commercial payor formularies
- Integration health monitoring dashboard
- Bulk data upload capabilities

### 2. **Patient Management**
- Comprehensive patient profiles with SDOH risk scores
- Advanced search and filtering (insurance type, state, risk level)
- Enriched patient data with geographic and coverage intelligence
- Program eligibility assessment

### 3. **Live Call Analysis**
- Voice AI simulation for patient calls
- Real-time transcript generation
- Intelligent barrier identification (transportation, cost, health literacy)
- Automated program recommendations
- Geographic and coverage intelligence during calls

### 4. **Analytics Dashboard**
- KPI metrics (call volume, patient count, savings, resolution rates)
- Program performance tracking
- SDOH barrier frequency analysis
- Geographic distribution visualization
- Comprehensive reporting tables

## 🏗️ Architecture

```
voice-ai-healthcare/
├── backend/          # FastAPI Python backend
│   ├── app/
│   │   ├── api/      # API routes
│   │   ├── models/   # SQLAlchemy models
│   │   ├── schemas/  # Pydantic schemas
│   │   ├── services/ # Business logic & mock data
│   │   └── core/     # Configuration & database
│   └── requirements.txt
├── frontend/         # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/ # API client
│   │   └── types/    # TypeScript types
│   └── package.json
├── data/            # Data storage
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites

- Docker Desktop (recommended) OR
- Python 3.11+ and Node.js 20+
- PostgreSQL 15+
- Redis 7+

### Option 1: Docker Setup (Recommended)

1. **Clone and navigate to the project:**
```bash
cd voice-ai-healthcare
```

2. **Copy environment variables:**
```bash
cp .env.example .env
```

3. **Start all services with Docker Compose:**
```bash
docker-compose up --build
```

This will start:
- PostgreSQL database (port 5432)
- Redis (port 6379)
- Backend API (port 8000)
- Frontend (port 5173)

4. **Initialize mock data:**

Once the services are running, open another terminal and run:
```bash
curl -X POST http://localhost:8000/api/init-data
```

Or use the "Initialize Mock Data" button in the Integrations tab.

5. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set up PostgreSQL and Redis:**
Ensure PostgreSQL and Redis are running locally.

5. **Update .env file with local database URL:**
```bash
DATABASE_URL=postgresql://voiceai:voiceai123@localhost:5432/voice_ai_healthcare
REDIS_URL=redis://localhost:6379
```

6. **Run the backend:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

7. **Initialize mock data:**
```bash
curl -X POST http://localhost:8000/api/init-data
```

#### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
echo "VITE_API_URL=http://localhost:8000" > .env
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Access the application:**
Open http://localhost:5173 in your browser

## 📊 Mock Data

The application comes with comprehensive mock data including:
- **50 patients** with varied insurance types and SDOH profiles
- **30 geographic profiles** across different ZIP codes
- **100 formulary entries** from various insurance plans
- **20 assistance programs** (copay, bridge, PAP, foundation)
- **30 call records** with transcripts and AI analysis
- **40 program enrollments**
- **9 data integration sources**

## 🎮 Usage Guide

### 1. Integrations Tab
- **Purpose:** Monitor and manage data source connections
- **Actions:**
  - Click "Initialize Mock Data" to populate the database
  - View connection status for each data source
  - Monitor sync health and error logs
  - See record counts and last sync times

### 2. Patients Tab
- **Purpose:** Manage patient information and access
- **Features:**
  - Search by name, MRN, or phone number
  - Filter by insurance type, risk level, or status
  - View patient cards with SDOH scores and insurance info
  - Click "View Profile" to see detailed patient information including:
    - Geographic SDOH profile
    - Insurance coverage details
    - Eligible assistance programs
  - Click "Call" to initiate voice AI analysis

### 3. Live Calls Tab
- **Purpose:** Simulate and analyze patient voice calls
- **Workflow:**
  1. Select a patient from the dropdown
  2. Click "Start Call Simulation"
  3. View real-time analysis including:
     - Call transcript
     - Geographic intelligence (SDOH factors)
     - Insurance coverage analysis
     - Identified barriers
     - AI-generated recommendations
  4. Execute recommended actions

### 4. Analytics Tab
- **Purpose:** Monitor performance and outcomes
- **Metrics:**
  - Call volume trends
  - Program performance by type
  - SDOH barrier frequency
  - Geographic patient distribution
  - Total savings and enrollments
  - First-call resolution rates

## 🔧 API Endpoints

### Patients
- `GET /api/patients/` - List all patients (with filters)
- `GET /api/patients/{id}` - Get patient with enriched data
- `POST /api/patients/` - Create new patient
- `PATCH /api/patients/{id}` - Update patient

### Calls
- `GET /api/calls/` - List all calls
- `GET /api/calls/{id}` - Get specific call
- `POST /api/calls/analyze` - Analyze a call (returns AI recommendations)
- `POST /api/calls/` - Create call record

### Analytics
- `GET /api/analytics/dashboard` - Get complete dashboard data
- `GET /api/analytics/kpi` - Get real-time KPI metrics

### Integrations
- `GET /api/integrations/` - List all data integrations
- `GET /api/integrations/health` - Get integration health metrics

### Data Initialization
- `POST /api/init-data` - Initialize mock data

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **Pydantic** - Data validation
- **Faker** - Mock data generation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **date-fns** - Date manipulation

## 📁 Database Schema

### Key Tables
- **patients** - Patient demographic and insurance information
- **geographic_profiles** - ZIP code-based SDOH and health data
- **formularies** - Insurance plan drug coverage details
- **calls** - Voice call records with AI analysis
- **assistance_programs** - Available patient assistance programs
- **enrollments** - Patient program enrollments
- **data_integrations** - Data source connection status

## 🔐 Security Notes

This is a **development/demo version** with mock data. For production use:

1. **Enable HIPAA compliance:**
   - Implement proper authentication (OAuth2, JWT)
   - Enable database encryption at rest
   - Implement audit logging
   - Add role-based access control (RBAC)
   - Use secure WebSocket connections for real-time features

2. **Data protection:**
   - PHI isolation in separate schemas
   - De-identification for analytics
   - Secure API endpoints with proper authentication

3. **Environment variables:**
   - Never commit `.env` files
   - Use secrets management (AWS Secrets Manager, etc.)
   - Rotate API keys regularly

## 🐛 Troubleshooting

### Docker Issues

**Problem:** Containers won't start
```bash
# Check logs
docker-compose logs backend
docker-compose logs postgres

# Restart services
docker-compose down
docker-compose up --build
```

**Problem:** Database connection errors
```bash
# Wait for PostgreSQL to be ready
docker-compose up postgres
# Wait 10-15 seconds, then start other services
docker-compose up backend frontend
```

### Database Issues

**Problem:** "Table does not exist" errors
```bash
# Recreate tables
docker-compose down -v  # Warning: This deletes all data
docker-compose up --build
# Then reinitialize mock data
curl -X POST http://localhost:8000/api/init-data
```

### Frontend Issues

**Problem:** API connection errors
- Check that `VITE_API_URL` in frontend `.env` matches your backend URL
- Ensure CORS is properly configured in backend

**Problem:** Blank screen or errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📈 Future Enhancements

### Phase 1: Real Data Integration
- Integrate actual AHRQ SDOH API
- Implement CMS data pipeline
- Build web scrapers for commercial payors
- Add state Medicaid formulary aggregation

### Phase 2: Live Voice AI
- Integrate Deepgram/AssemblyAI for STT
- Add ElevenLabs/Play.HT for TTS
- Implement LangChain/LangGraph conversation flows
- Add Twilio/Vonage for telephony

### Phase 3: Advanced Analytics
- Machine learning for adherence prediction
- Prescribing pattern analysis
- Market access optimization
- Clinical trial site selection

### Phase 4: Production Features
- User authentication and authorization
- Multi-tenant architecture
- Advanced reporting and exports
- Mobile responsive design
- Offline mode support

## 🤝 Contributing

This is a demo/prototype application. For production use:
1. Implement proper authentication
2. Add comprehensive error handling
3. Write unit and integration tests
4. Set up CI/CD pipelines
5. Implement logging and monitoring
6. Add data validation and sanitization

## 📄 License

This is a demonstration project for educational purposes.

## 📞 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review API documentation at http://localhost:8000/docs
3. Check Docker logs for error messages

---

**Built with ❤️ for improving patient access to healthcare**
