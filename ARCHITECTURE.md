# GreenOps AI Copilot - Architecture Diagrams

This document contains 10 professional Mermaid diagrams detailing the architecture, workflows, and pipelines of the GreenOps AI Copilot platform. These diagrams can be directly embedded into your GitHub README or technical documentation.

## 1. High-Level System Architecture
```mermaid
graph TD
    subgraph Clients["Clients"]
        UI["Web Dashboard (Next.js)"]
        CLI["CLI Tool / IDE Plugin"]
    end

    subgraph API_Layer["API Gateway (FastAPI)"]
        Gateway["REST / GraphQL API"]
    end

    subgraph Core_Services["Core Services"]
        Agent["AI Agent / Copilot"]
        Scorer["Green Score Engine"]
        Forecaster["Emissions Forecaster"]
        Recommender["Optimization Engine"]
    end

    subgraph Data_Layer["Data & Persistence"]
        DB[(PostgreSQL / SQLite)]
        Cache[(Redis Cache)]
    end

    subgraph External_Integrations["External Integrations"]
        AWS[("AWS Cost/Usage API")]
        Azure[("Azure Metrics")]
        GCP[("GCP Billing API")]
        LLM["LLM Provider (Gemini / OpenAI)"]
        GitHub["GitHub API (PRs & Repos)"]
    end

    UI --> Gateway
    CLI --> Gateway
    Gateway --> Core_Services
    Core_Services --> Data_Layer
    Core_Services --> External_Integrations
    Agent -.-> LLM
    Scorer -.-> GitHub
```

## 2. Data Flow Architecture
```mermaid
flowchart LR
    A[Cloud Providers (AWS, Azure, GCP)] -->|Usage & Billing Data| B(Data Ingestion Pipeline)
    B --> C{Data Normalization}
    C -->|Normalized Metrics| D[(Time-Series DB)]
    D --> E[Carbon Calculation Engine]
    E -->|CO2e Metrics| F[(Operational DB)]
    F --> G[Forecasting Model]
    F --> H[Recommendation Engine]
    G --> I[Dashboard & Reporting]
    H --> I
    I --> J((End User))
```

## 3. AI Agent Workflow
```mermaid
sequenceDiagram
    participant User
    participant CopilotUI as Copilot UI
    participant Backend as FastAPI Backend
    participant LLM as AI Model (Gemini)
    participant DB as Database (Metrics)

    User->>CopilotUI: Asks "Why did emissions spike?"
    CopilotUI->>Backend: POST /api/chat
    Backend->>DB: Fetch recent usage anomalies
    DB-->>Backend: Returns anomalies data
    Backend->>LLM: Send system prompt, context & query
    LLM-->>Backend: Stream AI response with insights
    Backend-->>CopilotUI: Return response stream
    CopilotUI-->>User: Displays intelligent explanation
```

## 4. Shift-Left Green Score Pipeline
```mermaid
graph LR
    A[Developer Commits Code] --> B[CI/CD Pipeline Triggered]
    B --> C[GreenOps GitHub Action]
    C --> D{Analyze Infrastructure Files}
    D -->|Dockerfiles, Terraform, etc.| E[Green Score API]
    E --> F[AI Pattern Recognition]
    F --> G[Calculate Grade A-F]
    G --> H{Threshold Check}
    H -->|Grade >= B| I[Pass Build]
    H -->|Grade < B| J[Fail Build / Warn]
    J --> K[Generate Auto-Fix PR]
```

## 5. User Journey Flowchart
```mermaid
flowchart TD
    Start([User Logs In]) --> Dashboard[View Main Dashboard]
    Dashboard --> InspectMetrics[Analyze Total CO2e & Spend]
    InspectMetrics --> AskCopilot{Need Insights?}
    AskCopilot -->|Yes| Chat[Chat with AI Copilot]
    AskCopilot -->|No| Recs[View Recommendations]
    Recs --> Action{Take Action?}
    Action -->|Auto-Fix| PR[AI Generates Pull Request]
    Action -->|Ignore| Dashboard
    PR --> GitHub[Review & Merge in GitHub]
    GitHub --> Start
```

## 6. Carbon Forecasting Pipeline
```mermaid
graph TD
    A[Historical Usage Data] --> B[Data Preprocessing & Cleaning]
    B --> C[Feature Engineering (Seasonality, Spikes)]
    C --> D{Forecasting Engine}
    D -->|Prophet / Time-Series| E[Baseline Projection]
    D -->|LLM Anomaly Detection| F[Event-based Projection]
    E --> G[Combine Forecasts]
    F --> G
    G --> H[Calculate Confidence Intervals]
    H --> I[Store Forecast Data]
    I --> J[Render Predictive Charts]
```

## 7. Recommendation Engine Workflow
```mermaid
flowchart LR
    subgraph Data Sources
        Metrics[(Cloud Metrics)]
        Limits[(Quotas & Limits)]
    end

    subgraph Analysis Phase
        Rules[Heuristics & Rules Engine]
        AI[LLM Pattern Matching]
    end

    subgraph Output Generation
        Impact[Calculate Impact vs Effort]
        Rank[Rank Recommendations]
    end

    Metrics --> Rules
    Limits --> Rules
    Metrics --> AI
    Rules --> Impact
    AI --> Impact
    Impact --> Rank
    Rank --> UI([Present to User])
```

## 8. Database ER Diagram
```mermaid
erDiagram
    USERS ||--o{ PROJECTS : manages
    PROJECTS ||--o{ CLOUD_ACCOUNTS : integrates
    PROJECTS ||--o{ EMISSION_LOGS : records
    PROJECTS ||--o{ RECOMMENDATIONS : receives
    
    USERS {
        int id PK
        string email
        string hashed_password
    }
    PROJECTS {
        int id PK
        int user_id FK
        string name
        string target_grade
    }
    CLOUD_ACCOUNTS {
        int id PK
        int project_id FK
        string provider
        string account_identifier
    }
    EMISSION_LOGS {
        int id PK
        int project_id FK
        float co2_amount
        float spend
        date timestamp
    }
    RECOMMENDATIONS {
        int id PK
        int project_id FK
        string title
        string status
        float estimated_savings
    }
```

## 9. Deployment Architecture
```mermaid
graph TD
    subgraph Vercel_Platform["Vercel Cloud"]
        NextApp["Frontend (Next.js Edge Network)"]
    end

    subgraph Backend_Cloud["Platform (Render / AWS)"]
        FastAPI["FastAPI Server (Python)"]
        BackgroundWorker["Celery / Background Tasks"]
    end

    subgraph Data_Storage["Managed Data"]
        RDS[("PostgreSQL")]
        Redis[("Redis")]
    end

    Client([Browser]) -->|HTTPS| NextApp
    NextApp -->|REST/JSON| FastAPI
    FastAPI --> BackgroundWorker
    FastAPI --> RDS
    BackgroundWorker --> Redis
    FastAPI --> Redis
```

## 10. Executive ESG Report Generation Flow
```mermaid
flowchart TD
    Trigger[User Clicks 'Export ESG Report'] --> Aggregation[Aggregate Monthly Metrics]
    Aggregation --> Calc[Calculate Scope 2 & 3 Emissions]
    Calc --> Targets{Compare vs ESG Targets}
    Targets --> Formatting[Generate Report Sections]
    Formatting --> AI_Summary[AI Drafts Executive Summary]
    AI_Summary --> PDF[PDF Generation Engine]
    PDF --> Download([Report Downloaded by Executive])
```
