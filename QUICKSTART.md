# 🚀 Quick Start Guide

Get the Voice AI Healthcare Platform running in **5 minutes**!

## Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- That's it! Docker handles everything else.

## Steps

### 1. Start the Application

```bash
cd voice-ai-healthcare
docker-compose up --build
```

Wait for all services to start (you'll see "Application startup complete" messages).

### 2. Initialize Mock Data

**Option A: Using the UI** (Recommended)
1. Open http://localhost:5173
2. Go to the "Integrations" tab
3. Click the green "Initialize Mock Data" button

**Option B: Using curl**
```bash
curl -X POST http://localhost:8000/api/init-data
```

### 3. Explore the Application

#### Integrations Tab
- View 9 connected data sources
- See sync status and health metrics

#### Patients Tab
- Browse 50 mock patients
- Search by name or MRN
- Filter by insurance type or risk level
- Click "View Profile" to see enriched data with SDOH factors

#### Live Calls Tab
- Select a patient from the dropdown
- Click "Start Call Simulation"
- Watch AI analyze the call in real-time
- See geographic intelligence, barriers, and recommendations

#### Analytics Tab
- View KPI metrics (calls, patients, savings)
- Explore charts and trends
- Analyze program performance
- See geographic distribution

## What's Included

### Mock Data Generated
- ✅ 50 patients with varied profiles
- ✅ 30 geographic SDOH profiles
- ✅ 100 insurance formulary entries
- ✅ 20 patient assistance programs
- ✅ 30 call records with AI analysis
- ✅ 40 program enrollments

### Services Running
- 🟢 Frontend: http://localhost:5173
- 🟢 Backend API: http://localhost:8000
- 🟢 API Docs: http://localhost:8000/docs
- 🟢 PostgreSQL: localhost:5432
- 🟢 Redis: localhost:6379

## Common Tasks

### Stop the Application
```bash
docker-compose down
```

### Restart with Fresh Data
```bash
docker-compose down -v  # ⚠️ This deletes all data
docker-compose up --build
# Then reinitialize mock data
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Access Database
```bash
docker exec -it voiceai-postgres psql -U voiceai -d voice_ai_healthcare
```

## Troubleshooting

### Services won't start?
```bash
docker-compose down
docker-compose up --build
```

### Port already in use?
Edit `docker-compose.yml` and change the port mappings:
```yaml
ports:
  - "8001:8000"  # Change 8000 to 8001
  - "5174:5173"  # Change 5173 to 5174
```

### Blank screen in browser?
1. Check browser console for errors (F12)
2. Ensure backend is running: http://localhost:8000/health
3. Clear browser cache and reload

### Database errors?
```bash
# Reset everything
docker-compose down -v
docker-compose up --build
```

## Next Steps

### Explore the API
Visit http://localhost:8000/docs for interactive API documentation

### Customize Mock Data
Edit `backend/app/services/mock_data.py` to change patient demographics, SDOH profiles, etc.

### Add Real Data
Replace mock data generators with actual API integrations:
- AHRQ SDOH Database
- CDC WONDER
- CMS Medicare Data

## Demo Scenarios

### Scenario 1: High-Risk Rural Patient
1. Go to Patients tab
2. Filter by "High Risk"
3. Look for rural patients (high SDOH score)
4. Click "View Profile" to see barriers
5. Go to Live Calls tab
6. Simulate a call with this patient
7. Observe AI recommendations for home delivery

### Scenario 2: Cost Barrier Analysis
1. Go to Patients tab
2. Find a patient with Commercial insurance
3. View their profile
4. Note the high copay estimate
5. Check eligible programs
6. Simulate a call
7. See AI recommend patient assistance programs

### Scenario 3: Analytics Dashboard
1. Go to Analytics tab
2. View call volume trends
3. Examine program performance
4. Identify states with highest risk scores
5. Analyze barrier frequency

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review API docs at http://localhost:8000/docs
- Inspect Docker logs: `docker-compose logs`

---

**Enjoy exploring the Voice AI Healthcare Platform!** 🎉
