# CVNiche - AI Career Platform Walkthrough

CVNiche is a comprehensive, AI-powered career platform that integrates resume building, ATS optimization, portfolio website generation, LinkedIn profile audits, and interactive career coaching into one ecosystem.

---

## 1. System Architecture

```mermaid
graph TD
    subgraph Web App
        FE[Next.js Web Client - Port 3000]
    end

    subgraph Backend APIs
        BE[NestJS API Gateway - Port 5000]
        DB[(PostgreSQL + pgvector)]
        RD[(Redis Queue)]
    end

    subgraph AI Processing
        AI[FastAPI AI Service - Port 8000]
        GEM[Google Gemini Models]
    end

    FE -->|REST API Requests| BE
    BE -->|Proxy Complex AI Workloads| AI
    AI -->|Semantic Queries / Matches| DB
    AI -->|Structured Chat & Analysis| GEM
    BE -->|Query & Save State| DB
    BE -->|Queue Tasks| RD
```

---

## 2. Directory Layout & Key Files

### Root Configurations
* [docker-compose.yml](file:///Users/enanglawrence/projects/customs/CVNiche/docker-compose.yml) - Provisions PostgreSQL with `pgvector` and Redis.
* [package.json](file:///Users/enanglawrence/projects/customs/CVNiche/package.json) - Configures monorepo npm workspaces.

### 🧩 NestJS Backend (`/backend`)
* [schema.prisma](file:///Users/enanglawrence/projects/customs/CVNiche/backend/prisma/schema.prisma) - Database models (Users, Resumes, Portfolios, Applications, Chat logs).
* [PrismaService](file:///Users/enanglawrence/projects/customs/CVNiche/backend/src/prisma/prisma.service.ts) - Manages database connections.
* [AuthGuard](file:///Users/enanglawrence/projects/customs/CVNiche/backend/src/auth/auth.guard.ts) - Protects private endpoints using signed JWTs.
* [ProfileService](file:///Users/enanglawrence/projects/customs/CVNiche/backend/src/profile/profile.service.ts) - Manages user profile sub-items (Experiences, Education, Projects).
* [ResumeService](file:///Users/enanglawrence/projects/customs/CVNiche/backend/src/resume/resume.service.ts) - Customizes resume outputs and renders ATS-friendly HTML exports.
* [PortfolioService](file:///Users/enanglawrence/projects/customs/CVNiche/backend/src/portfolio/portfolio.service.ts) - Dynamic portfolio builder with a public slug resolver.
* [JobService](file:///Users/enanglawrence/projects/customs/CVNiche/backend/src/job/job.service.ts) - Backs the application tracker Kanban stages.
* [AiService](file:///Users/enanglawrence/projects/customs/CVNiche/backend/src/ai/ai.service.ts) - Dispatches request payloads to the FastAPI microservice and hosts mock fallback routines.

### 🐍 FastAPI AI Service (`/ai-service`)
* [main.py](file:///Users/enanglawrence/projects/customs/CVNiche/ai-service/app/main.py) - Exposes REST endpoints (`/api/ats/analyze`, `/api/ats/tailor`, `/api/linkedin/optimize`, `/api/coach/chat`, `/api/jobs/match`).
* [gemini.py](file:///Users/enanglawrence/projects/customs/CVNiche/ai-service/app/services/gemini.py) - Wrapper calling Gemini (`gemini-2.5-flash` and `text-embedding-004`) using the official `google-genai` library.
* [ats_optimizer.py](file:///Users/enanglawrence/projects/customs/CVNiche/ai-service/app/services/ats_optimizer.py) - Scores resume-job matches and highlights missing keywords.
* [linkedin_optimizer.py](file:///Users/enanglawrence/projects/customs/CVNiche/ai-service/app/services/linkedin_optimizer.py) - Optimizes headers and about summaries.
* [job_matcher.py](file:///Users/enanglawrence/projects/customs/CVNiche/ai-service/app/services/job_matcher.py) - Generates embeddings and calculates cosine similarity.

### ⚛️ Next.js Web Client (`/frontend`)
* [SidebarLayout.tsx](file:///Users/enanglawrence/projects/customs/CVNiche/frontend/src/app/components/SidebarLayout.tsx) - Responsive navigation bar.
* [page.tsx](file:///Users/enanglawrence/projects/customs/CVNiche/frontend/src/app/page.tsx) - Premium stats scoreboard dashboard.
* [resumes/page.tsx](file:///Users/enanglawrence/projects/customs/CVNiche/frontend/src/app/resumes/page.tsx) - Live ATS scoring interface.
* [portfolios/page.tsx](file:///Users/enanglawrence/projects/customs/CVNiche/frontend/src/app/portfolios/page.tsx) - Custom theme settings and browser preview.
* [linkedin/page.tsx](file:///Users/enanglawrence/projects/customs/CVNiche/frontend/src/app/linkedin/page.tsx) - Rephrasing audit dashboard.
* [coach/page.tsx](file:///Users/enanglawrence/projects/customs/CVNiche/frontend/src/app/coach/page.tsx) - Chat window with mock prompts.
* [tracker/page.tsx](file:///Users/enanglawrence/projects/customs/CVNiche/frontend/src/app/tracker/page.tsx) - Kanban board.

### 📱 Flutter Mobile App (`/mobile`)
* [main.dart](file:///Users/enanglawrence/projects/customs/CVNiche/mobile/lib/main.dart) - Mobile configuration router.
* [dashboard_screen.dart](file:///Users/enanglawrence/projects/customs/CVNiche/mobile/lib/screens/dashboard_screen.dart) - Mobile layout showing career metrics.
* [chat_screen.dart](file:///Users/enanglawrence/projects/customs/CVNiche/mobile/lib/screens/chat_screen.dart) - Mobile chatbot view.

---

## 3. Setup & Running Instructions

### Step 1: Start Database Containers
```bash
npm run db:up
```

### Step 2: Configure Environment Variables
Inside `backend/.env`, configure your connection parameters and API Keys:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cvniche?schema=public"
JWT_SECRET="cvniche-super-secret-jwt-key-2026"
GEMINI_API_KEY="your-gemini-api-key"
```

Inside `ai-service/` environment (or exported in your shell):
```bash
export GEMINI_API_KEY="your-gemini-api-key"
```

### Step 3: Run Database Migrations
```bash
npm run prisma:migrate
```

### Step 4: Run the Services (Local Dev)
Open three terminal windows/panes to run the components:

1. **NestJS API Service**:
   ```bash
   npm run dev:backend
   ```
2. **FastAPI AI Service**:
   ```bash
   npm run dev:ai
   ```
3. **Next.js Web Client**:
   ```bash
   npm run dev:frontend
   ```
   *Visit `http://localhost:3000` to interact with the platform.*
