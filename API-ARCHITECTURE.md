# 🌐 Client-Server Architecture

## Overview

This document describes how the CUP Voting System could be transformed from a client-only application to a full client-server architecture.

## 📋 API Specification

See [openapi.yaml](openapi.yaml) for the complete REST API specification.

You can view the API documentation using:
- **Swagger UI**: https://editor.swagger.io (paste the YAML content)
- **Redoc**: https://redocly.github.io/redoc/
- **VS Code Extension**: OpenAPI (Swagger) Editor

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[React App] --> B[Candidati Section]
        A --> C[Schede Section]
        A --> D[Risultati Section]
        B --> E[API Client]
        C --> E
        D --> E
    end

    subgraph "API Layer"
        E -->|HTTPS REST| F[API Gateway / Load Balancer]
        F --> G[Express.js Server]
        G --> H[Authentication Middleware]
        H --> I[Candidates Routes]
        H --> J[Ballots Routes]
        H --> K[Results Routes]
        H --> L[System Routes]
    end

    subgraph "Business Logic Layer"
        I --> M[Validation Service]
        J --> M
        K --> N[Vote Counting Service]
        M --> O[Data Access Layer]
        N --> O
    end

    subgraph "Data Layer"
        O -->|ORM| P[(PostgreSQL Database)]
        P --> Q[candidates table]
        P --> R[ballots table]
        P --> S[results table]
        P --> T[audit_log table]
    end

    subgraph "Cache Layer"
        N -.->|Cache Results| U[Redis Cache]
    end

    style A fill:#e1f5ff
    style G fill:#fff4e1
    style P fill:#f0e1ff
    style U fill:#ffe1e1
```

## 🔄 Request Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client (React)
    participant A as API Server
    participant DB as Database
    participant Cache as Redis Cache

    U->>C: Submit Ballot
    C->>A: POST /api/v1/ballots
    activate A
    A->>A: Validate JWT Token
    A->>A: Validate Ballot Data
    A->>DB: Check Candidates Exist
    DB-->>A: Candidates Data
    A->>A: Apply Voting Rules
    alt Valid Ballot
        A->>DB: INSERT ballot
        A->>DB: UPDATE results
        DB-->>A: Success
        A->>Cache: Invalidate results cache
        A-->>C: 201 Created + Ballot Data
        C-->>U: Success Message
    else Invalid Ballot
        A-->>C: 400 Bad Request + Errors
        C-->>U: Validation Errors
    end
    deactivate A
```

## 🗄️ Database Schema (ER Diagram)

```mermaid
erDiagram
    CANDIDATES {
        uuid id PK
        varchar nome
        varchar parrocchia
        varchar fascia_eta
        timestamp created_at
        timestamp updated_at
    }

    BALLOTS {
        uuid id PK
        varchar tipo
        timestamp timestamp
        jsonb votes
        boolean cancelled
        timestamp cancelled_at
    }

    RESULTS {
        uuid candidate_id PK,FK
        integer vote_count
        timestamp last_updated
    }

    AUDIT_LOG {
        uuid id PK
        varchar action
        varchar entity_type
        uuid entity_id
        uuid user_id
        jsonb changes
        timestamp timestamp
    }

    USERS {
        uuid id PK
        varchar username
        varchar email
        varchar password_hash
        varchar role
        timestamp created_at
    }

    CANDIDATES ||--o{ RESULTS : "has votes in"
    BALLOTS }o--o{ CANDIDATES : "contains votes for"
    USERS ||--o{ AUDIT_LOG : "performs actions"
```

## 🔌 API Endpoints Map

```mermaid
mindmap
  root((CUP API))
    Candidates
      GET /candidates
      POST /candidates
      GET /candidates/{id}
      PUT /candidates/{id}
      DELETE /candidates/{id}
    Ballots
      GET /ballots
      POST /ballots
      GET /ballots/{id}
      DELETE /ballots/{id}
      POST /ballots/validate
      GET /ballots/summary
    Results
      GET /results
      GET /results/export
    System
      GET /system/config
      GET /system/health
      POST /system/reset
    Auth
      POST /auth/login
      POST /auth/logout
      GET /auth/me
```

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant A as Auth API
    participant DB as Database

    U->>C: Enter Credentials
    C->>A: POST /auth/login
    activate A
    A->>DB: Query User
    DB-->>A: User Data
    A->>A: Verify Password Hash
    alt Valid Credentials
        A->>A: Generate JWT Token
        A-->>C: 200 OK + JWT Token
        C->>C: Store Token in localStorage
        C-->>U: Login Success
    else Invalid Credentials
        A-->>C: 401 Unauthorized
        C-->>U: Login Failed
    end
    deactivate A

    Note over C: Subsequent requests include JWT

    U->>C: Fetch Candidates
    C->>A: GET /candidates<br/>Authorization: Bearer {token}
    activate A
    A->>A: Verify JWT Token
    A->>DB: Query Candidates
    DB-->>A: Candidates Data
    A-->>C: 200 OK + Data
    C-->>U: Display Candidates
    deactivate A
```

## 🏛️ System Architecture Layers

```mermaid
graph LR
    subgraph "Presentation Layer"
        A[React Components]
        B[State Management]
        C[API Client]
    end

    subgraph "API Layer"
        D[REST Endpoints]
        E[Authentication]
        F[Validation]
    end

    subgraph "Business Logic"
        G[Voting Rules Engine]
        H[Vote Counting]
        I[Candidate Management]
    end

    subgraph "Data Access"
        J[ORM / Query Builder]
        K[Database Migrations]
    end

    subgraph "Infrastructure"
        L[(PostgreSQL)]
        M[Redis Cache]
        N[File Storage]
    end

    A --> C
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    F --> I
    G --> J
    H --> J
    I --> J
    J --> L
    J --> M
    J --> N

    style A fill:#e1f5ff
    style D fill:#fff4e1
    style G fill:#e1ffe1
    style L fill:#f0e1ff
```

## 📊 Data Flow for Ballot Registration

```mermaid
flowchart TD
    A[User Selects Candidates] --> B[Client Validates Form]
    B --> C{Form Valid?}
    C -->|No| D[Show Errors]
    C -->|Yes| E[POST /ballots]
    E --> F[Server Authentication]
    F --> G{Token Valid?}
    G -->|No| H[401 Unauthorized]
    G -->|Yes| I[Validate Ballot Data]
    I --> J[Check Candidate IDs]
    J --> K[Apply Voting Rules]
    K --> L{Ballot Valid?}
    L -->|No| M[Return Validation Errors]
    L -->|Yes| N[Begin Transaction]
    N --> O[Insert Ballot Record]
    O --> P[Update Vote Counts]
    P --> Q[Commit Transaction]
    Q --> R[Invalidate Cache]
    R --> S[Return Success]
    S --> T[Update UI]

    style C decision
    style G decision
    style L decision
    style N fill:#ffe1e1
    style Q fill:#ffe1e1
    style S fill:#e1ffe1
```

## 🔄 State Management Architecture

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> Loading: User Action
    Loading --> Success: API Response OK
    Loading --> Error: API Response Error

    Success --> Idle: Reset
    Error --> Idle: Reset
    Error --> Loading: Retry

    Success --> Optimistic: User Action
    Optimistic --> Success: API Confirms
    Optimistic --> Error: API Rejects
    Optimistic --> Idle: Rollback

    note right of Loading
        Show loading spinner
        Disable form
    end note

    note right of Success
        Update UI
        Show success toast
        Clear cache
    end note

    note right of Error
        Show error message
        Enable retry button
    end note

    note right of Optimistic
        Update UI immediately
        Queue API request
        Rollback on error
    end note
```

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Client Deployment"
        A[React Build] --> B[Static Files]
        B --> C[CDN / Vercel / Netlify]
    end

    subgraph "Load Balancing"
        D[Users] --> E[Load Balancer / Nginx]
    end

    subgraph "API Servers Auto-scaling"
        E --> F1[API Server 1]
        E --> F2[API Server 2]
        E --> F3[API Server N...]
    end

    subgraph "Database Cluster"
        F1 --> G[Primary DB]
        F2 --> G
        F3 --> G
        G --> H[Read Replica 1]
        G --> I[Read Replica 2]
    end

    subgraph "Caching Layer"
        F1 --> J[Redis Primary]
        F2 --> J
        F3 --> J
        J --> K[Redis Replica]
    end

    subgraph "Monitoring & Logging"
        F1 -.-> L[Prometheus]
        F2 -.-> L
        F3 -.-> L
        L --> M[Grafana]
        F1 -.-> N[ELK Stack]
        F2 -.-> N
        F3 -.-> N
    end

    style C fill:#e1f5ff
    style E fill:#fff4e1
    style G fill:#f0e1ff
    style J fill:#ffe1e1
    style L fill:#e1ffe1
```

## 📦 Technology Stack

```mermaid
mindmap
  root((Tech Stack))
    Frontend
      React 19
      TailwindCSS
      React Query
      Axios
      Zustand
    Backend
      Node.js
      Express/Fastify
      TypeScript
      Passport.js
      JWT
    Database
      PostgreSQL
      Prisma ORM
      Redis Cache
    DevOps
      Docker
      GitHub Actions
      Nginx
      Prometheus
      Grafana
    Testing
      Jest
      Supertest
      Playwright
      k6 Load Testing
```

## 🔐 Security Layers

```mermaid
graph LR
    A[Client Request] --> B{HTTPS?}
    B -->|No| C[Reject]
    B -->|Yes| D[Rate Limiter]
    D --> E{Within Limits?}
    E -->|No| F[429 Too Many Requests]
    E -->|Yes| G[CORS Check]
    G --> H{Origin Allowed?}
    H -->|No| I[403 Forbidden]
    H -->|Yes| J[JWT Validation]
    J --> K{Valid Token?}
    K -->|No| L[401 Unauthorized]
    K -->|Yes| M[RBAC Check]
    M --> N{Has Permission?}
    N -->|No| O[403 Forbidden]
    N -->|Yes| P[Input Validation]
    P --> Q{Valid Input?}
    Q -->|No| R[400 Bad Request]
    Q -->|Yes| S[SQL Injection Prevention]
    S --> T[XSS Prevention]
    T --> U[Process Request]

    style U fill:#e1ffe1
    style C fill:#ffe1e1
    style F fill:#ffe1e1
    style I fill:#ffe1e1
    style L fill:#ffe1e1
    style O fill:#ffe1e1
    style R fill:#ffe1e1
```

## 📈 Performance Optimization Strategy

```mermaid
graph TD
    A[Incoming Request] --> B{Cached?}
    B -->|Yes| C[Return from Redis]
    B -->|No| D{Read or Write?}
    D -->|Read| E[Query Read Replica]
    D -->|Write| F[Query Primary DB]
    E --> G[Cache Result]
    F --> H[Invalidate Cache]
    G --> I[Return Response]
    H --> I

    J[Background Job] --> K[Precompute Results]
    K --> L[Update Cache]
    K --> M[Update Materialized Views]

    style C fill:#e1ffe1
    style G fill:#ffe1e1
    style K fill:#fff4e1
```

## 🧪 Testing Strategy

```mermaid
graph TB
    subgraph "Testing Pyramid"
        A[E2E Tests<br/>Playwright]
        B[Integration Tests<br/>Supertest]
        C[Unit Tests<br/>Jest]
    end

    subgraph "Test Coverage"
        D[API Endpoints]
        E[Business Logic]
        F[Database Operations]
        G[Authentication]
        H[Validation]
    end

    A --> D
    B --> D
    B --> E
    B --> F
    B --> G
    C --> E
    C --> H

    subgraph "Performance Testing"
        I[Load Testing<br/>k6]
        J[Stress Testing]
    end

    I --> D
    J --> D

    style A fill:#ffe1e1
    style B fill:#fff4e1
    style C fill:#e1ffe1
```

## 🎯 Migration Phases

```mermaid
gantt
    title Migration to Client-Server Architecture
    dateFormat YYYY-MM-DD
    section Phase 1: Backend Setup
    Setup Node.js Server           :a1, 2024-01-01, 7d
    Configure Database             :a2, after a1, 7d
    Create Data Models            :a3, after a2, 5d
    section Phase 2: API Development
    Implement Candidates API       :b1, after a3, 7d
    Implement Ballots API         :b2, after b1, 7d
    Implement Results API         :b3, after b2, 5d
    Add Authentication            :b4, after b3, 5d
    section Phase 3: Frontend Integration
    Create API Client             :c1, after b4, 5d
    Replace localStorage          :c2, after c1, 7d
    Add Loading States            :c3, after c2, 5d
    Error Handling                :c4, after c3, 3d
    section Phase 4: Testing & Deploy
    Integration Testing           :d1, after c4, 7d
    Security Audit               :d2, after d1, 5d
    Performance Testing          :d3, after d2, 5d
    Production Deployment        :d4, after d3, 3d
```

---

## 📝 Quick Start Example

### API Client Setup (React)

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const candidatesApi = {
  getAll: (params) => api.get('/candidates', { params }),
  create: (data) => api.post('/candidates', data),
  delete: (id) => api.delete(`/candidates/${id}`)
};
```

### Using React Query

```javascript
// src/hooks/useCandidates.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { candidatesApi } from '../services/api';

export const useCandidates = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => candidatesApi.getAll()
  });

  const createMutation = useMutation({
    mutationFn: candidatesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    }
  });

  return {
    candidates: data?.data?.data || [],
    isLoading,
    error,
    createCandidate: createMutation.mutate
  };
};
```

---

**Complete API specification available in [openapi.yaml](openapi.yaml)** 🚀
