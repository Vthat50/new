# Technology Stack

## Overview
This healthcare voice AI application is built with modern web technologies, focusing on scalability, performance, and user experience. The system integrates conversational AI with SMS notifications and comprehensive analytics dashboards.

---

## Current Implementation (Demo)

### Frontend
- **Framework**: React 18.2
- **Language**: TypeScript 5.3
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom components with design system
- **Animations**: Framer Motion 12.23
- **Routing**: React Router DOM 6.21
- **Icons**: Lucide React 0.303

### State Management & Data
- **Global State**: Zustand 4.4
- **Data Fetching**: TanStack React Query 5.17
- **Client-side Storage**: Local Storage (demo data)

### AI & Communication
- **Voice AI**: ElevenLabs Conversational AI Platform
  - Real-time voice conversations
  - Custom system prompts
  - Webhook-based tool integration
- **SMS Integration**: Twilio SMS API 5.0
  - Automated text notifications
  - Multi-template messaging
  - E.164 phone number formatting

### Backend & Infrastructure
- **Hosting**: Vercel
- **Serverless Functions**: Vercel Edge Functions (Node.js 20.x)
  - `/api/send-sms` - Generic SMS endpoint
  - `/api/send-copay-card` - Copay card delivery
  - `/api/send-prior-auth-update` - Prior authorization updates
- **API Layer**: RESTful endpoints
- **Runtime**: Node.js with ES Modules

### Data Visualization
- **Charts Library**: Recharts 2.10
  - Line charts for call trends
  - Bar charts for volume metrics
  - Heatmaps for call patterns (GitHub contribution style)
- **PDF Generation**: jsPDF 3.0

### AI Models
- **Language Models**:
  - OpenAI GPT (via OpenAI SDK 6.8)
  - Google Generative AI (Gemini, SDK 0.24)

### Development Tools
- **Linting**: ESLint 8.56 with TypeScript support
- **CSS Processing**: PostCSS 8.4, Autoprefixer 10.4
- **Type Checking**: TypeScript strict mode

---

## Production Tech Stack Recommendations

For a production healthcare application with real patient data and compliance requirements:

### Frontend (Same as Demo)
- React 18+ with TypeScript
- Next.js 14+ (instead of Vite for SSR/SSG capabilities)
- Tailwind CSS
- TanStack Query for data fetching
- Zustand or Redux Toolkit for state management

### Backend & API
- **Framework**: Next.js API Routes or Express.js
- **Language**: TypeScript
- **API Architecture**: RESTful or GraphQL (Apollo Server)
- **Alternative**: tRPC for end-to-end type safety

### Database
- **Primary Database**: PostgreSQL 15+ (HIPAA-compliant setup)
  - Patient records
  - Call history
  - Analytics data
  - Audit logs
- **ORM**: Prisma 5+ or Drizzle ORM
- **Caching**: Redis for session management and query caching
- **Vector Database**: Pinecone or pgvector (for AI embeddings)

### Authentication & Authorization
- **Auth Provider**: NextAuth.js, Auth0, or Clerk
- **Session Management**: JWT tokens with Redis
- **MFA**: Time-based OTP (TOTP) support
- **Role-Based Access Control (RBAC)**: Custom middleware
- **Compliance**: HIPAA-compliant authentication flows

### Real-time Features
- **WebSockets**: Socket.io or Pusher
- **Real-time DB**: Supabase Realtime or Firebase Realtime Database
- **Use Cases**:
  - Live call status updates
  - Real-time notifications
  - Admin dashboard live metrics

### File Storage
- **Service**: AWS S3 or Google Cloud Storage
- **CDN**: CloudFront or Cloudflare
- **Encryption**: Server-side encryption (SSE-S3 or SSE-KMS)
- **Use Cases**:
  - Medical documents
  - Call recordings (encrypted)
  - PDF reports

### Infrastructure & Hosting
- **Hosting**:
  - AWS (EC2, ECS, or Lambda)
  - Google Cloud Platform
  - Or continue with Vercel (Pro/Enterprise for HIPAA BAA)
- **Container Orchestration**: Docker + Kubernetes (for AWS/GCP)
- **Load Balancer**: AWS ALB or GCP Load Balancer
- **Auto-scaling**: Based on traffic patterns

### Monitoring & Observability
- **APM**: Datadog or New Relic
- **Error Tracking**: Sentry
- **Logging**:
  - Structured logging with Winston or Pino
  - Centralized logs: Datadog, CloudWatch, or Stackdriver
- **Uptime Monitoring**: Pingdom or UptimeRobot
- **Analytics**:
  - User analytics: PostHog or Mixpanel
  - Business intelligence: Metabase or Tableau

### Security
- **HIPAA Compliance**:
  - Business Associate Agreement (BAA) with all vendors
  - End-to-end encryption for PHI
  - Audit logging for all data access
  - Data retention policies
- **Secrets Management**: AWS Secrets Manager or HashiCorp Vault
- **API Security**:
  - Rate limiting (Redis-based)
  - API keys with rotation
  - OAuth 2.0 for third-party integrations
- **DDoS Protection**: Cloudflare or AWS Shield
- **Vulnerability Scanning**: Snyk or GitHub Dependabot

### CI/CD Pipeline
- **Version Control**: GitHub or GitLab
- **CI/CD**: GitHub Actions, GitLab CI, or CircleCI
- **Testing Pipeline**:
  - Unit tests: Vitest or Jest
  - Integration tests: Supertest
  - E2E tests: Playwright or Cypress
  - API tests: Postman/Newman
- **Code Quality**: SonarQube
- **Deployment Strategy**: Blue-green or canary deployments

### Testing
- **Unit Tests**: Vitest (for Vite) or Jest
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright or Cypress
- **API Tests**: Supertest or Postman
- **Load Testing**: k6 or Apache JMeter
- **Coverage**: 80%+ code coverage requirement

### Communication Services (Production)
- **SMS**: Twilio (same as demo)
- **Email**: SendGrid or AWS SES
- **Voice**: Twilio Programmable Voice + ElevenLabs
- **Push Notifications**: Firebase Cloud Messaging or OneSignal
- **In-app Notifications**: WebSockets + React Query

### Data Processing & Analytics
- **ETL Pipeline**: Apache Airflow or Dagster
- **Data Warehouse**: Snowflake, BigQuery, or Redshift
- **Analytics Engine**:
  - Real-time: Apache Kafka + Flink
  - Batch: dbt for data transformations
- **BI Tools**: Looker, Tableau, or Metabase

### Compliance & Data Privacy
- **HIPAA**:
  - Encrypted data at rest (AES-256)
  - Encrypted data in transit (TLS 1.3)
  - Audit logs for PHI access
  - BAA with Twilio, ElevenLabs, hosting provider
- **Data Anonymization**: For analytics and ML training
- **Consent Management**: OneTrust or custom solution
- **Data Retention**: Automated policies (7 years for medical records)

### AI/ML Infrastructure (Production)
- **Model Serving**:
  - OpenAI API (GPT-4) with fallback to GPT-3.5
  - Self-hosted LLMs via Hugging Face or Replicate (for cost optimization)
- **Vector Search**: Pinecone or Weaviate
- **Prompt Management**: LangSmith or custom prompt versioning
- **Model Monitoring**: Weights & Biases or MLflow
- **Fine-tuning**: Custom models on medical domain data (with proper data anonymization)

### Backup & Disaster Recovery
- **Database Backups**:
  - Automated daily backups (retained 30 days)
  - Point-in-time recovery (PITR)
- **Cross-region Replication**: For disaster recovery
- **RTO**: < 4 hours
- **RPO**: < 15 minutes
- **DR Plan**: Documented and tested quarterly

---

## Architecture Comparison

### Demo Architecture (Current)
```
User → React SPA → Vercel Edge Functions → Twilio
                 ↘ ElevenLabs API
                 ↘ OpenAI API
                 ↘ Local Storage (demo data)
```

### Production Architecture (Recommended)
```
User → Next.js (SSR) → API Gateway → Application Server (Node.js)
                                    ↓
                                PostgreSQL (Primary DB)
                                    ↓
                                Redis (Cache)
                                    ↘
                                    S3 (File Storage)
                                    ↓
                      External Services:
                      - Twilio (SMS/Voice)
                      - ElevenLabs (Voice AI)
                      - OpenAI (LLM)
                      - Sentry (Error Tracking)
                      - Datadog (Monitoring)

```

---

## Migration Path from Demo to Production

### Phase 1: Database Integration
1. Set up PostgreSQL with Prisma ORM
2. Design schema for patients, calls, prescriptions, etc.
3. Implement data migrations from local storage
4. Add database connection pooling

### Phase 2: Authentication & Security
1. Implement NextAuth.js with MFA
2. Set up RBAC for different user roles
3. Add audit logging for all sensitive operations
4. Obtain HIPAA BAA from all vendors

### Phase 3: Real-time Features
1. Add WebSocket support for live updates
2. Implement real-time dashboard metrics
3. Add push notifications

### Phase 4: Monitoring & Testing
1. Set up Sentry error tracking
2. Add Datadog APM and logging
3. Implement comprehensive test suite (unit, integration, E2E)
4. Set up load testing

### Phase 5: Compliance & Production Readiness
1. HIPAA compliance audit
2. Security penetration testing
3. Performance optimization
4. Documentation (API docs, runbooks)
5. Disaster recovery testing

---

## Scalability Considerations

### Current Demo Limitations
- Client-side data storage (no persistence)
- No database (limited to browser memory)
- No authentication/authorization
- No real patient data handling
- No HIPAA compliance measures

### Production Scalability Features
- **Horizontal Scaling**: Auto-scaling application servers
- **Database Sharding**: For handling millions of patient records
- **CDN**: Global content delivery
- **Caching Strategy**: Multi-layer caching (Redis + CDN)
- **Async Processing**: Message queues (RabbitMQ or AWS SQS) for:
  - SMS delivery
  - PDF generation
  - Report processing
  - Analytics aggregation
- **Connection Pooling**: Efficient database connections
- **Rate Limiting**: Protect APIs from abuse

---

## Cost Optimization (Production)

### Infrastructure
- Auto-scaling to match demand
- Reserved instances for predictable workloads
- Spot instances for batch jobs
- CDN caching to reduce origin requests

### Third-party Services
- OpenAI: Caching responses for common queries
- Twilio: Bulk pricing for high-volume SMS
- ElevenLabs: Optimize voice call duration

### Database
- Read replicas for analytics queries
- Query optimization and indexing
- Archival strategy for old data

---

## Development Workflow

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
npm run lint         # Run ESLint
npm run build:check  # Type check + build
```

### Production Build
```bash
npm run build        # Production build
vercel --prod        # Deploy to Vercel
```

### Testing (Production)
```bash
npm run test         # Unit tests
npm run test:e2e     # E2E tests
npm run test:coverage # Coverage report
```

---

## Documentation & Resources

### Current Documentation
- `README_SMS.md` - SMS integration guide
- `QUICK_SMS_SETUP.md` - Quick setup reference
- `SMS_SETUP_GUIDE.md` - Detailed SMS configuration
- `TECH_STACK.md` - This file

### Production Documentation Needs
- API Documentation (OpenAPI/Swagger)
- Architecture Decision Records (ADRs)
- Runbook for on-call engineers
- HIPAA compliance documentation
- Data flow diagrams
- Security protocols
- Incident response procedures

---

## Conclusion

The current implementation uses a modern, serverless architecture suitable for demonstrations and prototypes. For production deployment with real patient data:

1. **Database Migration**: Move from local storage to PostgreSQL
2. **Authentication**: Implement secure, HIPAA-compliant auth
3. **Infrastructure**: Upgrade to production-grade hosting with proper monitoring
4. **Compliance**: Ensure full HIPAA compliance with BAAs, encryption, and audit logs
5. **Testing**: Comprehensive test coverage across all layers
6. **Monitoring**: Real-time observability and error tracking

The modular architecture makes this migration path straightforward, with the ability to incrementally add production features without disrupting the core application logic.
