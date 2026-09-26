# NyayaSetu (न्यायसेतु) ⚖️

> **"Understand Your Legal Documents. Know Your Next Step."**  
> *Upload → Understand → Analyze → Compare → Ask → Prepare → Act*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20TS-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%201.5-4285F4.svg?style=flat&logo=google)](https://ai.google.dev)
[![ChromaDB](https://img.shields.io/badge/Vector%20Store-ChromaDB-FF6F00.svg?style=flat)](https://trychroma.com)

---

## 🏛️ Product Vision

**NyayaSetu** is a production-quality GenAI-powered Legal Information, Document Intelligence, Risk-Awareness, and Preparation platform. It bridges the gap between complicated, jargon-heavy legal contracts and everyday citizens, tenants, employees, freelancers, and small business owners.

### ⚠️ Legal Principle & Guardrails
> **NyayaSetu does NOT replace lawyers or provide definitive legal advice.**  
> It empowers users with structured comprehension, risk flags, grounded clause explanations, timelines, and consultation briefs so they can make informed choices and have 5x more productive conversations with qualified legal professionals.

---

## 🌟 Key Differentiating Features (USPs)

| Feature | Description |
| :--- | :--- |
| **🩺 Legal Health Check** | Comprehensive multi-factor diagnostic extracting summary, parties, dates, monetary commitments, rights, and categorized risk flags (*Attention Needed*, *Review Recommended*, *Potential Risk*). |
| **🔍 Legal Lens (Innovative)** | Reorganize document insights across 6 situational viewpoints: **💰 Money**, **⏰ Deadlines**, **⚠️ Risk**, **🔐 Privacy**, **💡 Rights**, and **📋 Obligations**. |
| **⚖️ Contract Comparison & "Change Impact"** | Side-by-side comparison matrix with our proprietary **Change Impact Engine** explaining *What changed?*, *Who is affected?*, and *What should you ask?* |
| **💬 Ask Your Document (Grounded RAG)** | Conversational assistant citing exact **Document Sections**, **Page Numbers**, and **Clause Verbatim Quotes**. Zero hallucinations. |
| **📝 Prepare My Lawyer Brief** | Generates exportable, printable Markdown / PDF consultation briefs with custom client concerns, target questions, and legal ambiguity highlights. |
| **📅 Interactive Legal Timeline** | Chronological visual pipeline tracking start dates, rent/fee due days, lock-in expiries, renewal windows, and notice deadlines. |
| **📋 Obligation Tracker** | Interactive table categorizing responsibilities with live status tracking (*Pending*, *Completed*, *Needs Review*). |
| **🌐 Multilingual Explanations** | Support for **English, Hindi (हिन्दी), Marathi (मराठी), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Gujarati (ગુજરાતી)** preserving original legal terms with localized context. |
| **⚡ 3-Tier Simplifier** | Real-time reading level toggle: **Legal Standard**, **Simple Language**, and **Very Simple (Plain English)**. |

---

## 🏗️ Technical Architecture

```
                                  ┌───────────────────────────┐
                                  │   NyayaSetu Client (UI)   │
                                  │  React 18 + Vite + TS     │
                                  │  Tailwind CSS v4          │
                                  └─────────────┬─────────────┘
                                                │ REST API / JWT
                                  ┌─────────────▼─────────────┐
                                  │   FastAPI Python Backend  │
                                  │   Asynchronous Engine     │
                                  └──────┬──────────────┬─────┘
                                         │              │
                   ┌─────────────────────┴──────┐ ┌─────┴────────────────────┐
                   │  Document Intelligence RAG │ │ Data & Persistence Layer │
                   ├────────────────────────────┤ ├──────────────────────────┤
                   │ • PyMuPDF / python-docx    │ │ • SQLite / aiosqlite     │
                   │ • text-embedding-004       │ │ • SQLAlchemy 2.0 Async   │
                   │ • ChromaDB Vector DB       │ │ • BCrypt + JWT Security  │
                   │ • Gemini 1.5 Flash LLM     │ │ • Local Upload Vault     │
                   └────────────────────────────┘ └──────────────────────────┘
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**

### Option A: 1-Click Launch (Windows)
Double-click `start.bat` in the project root directory.

---

### Option B: Manual Setup

#### 1. Backend Setup
```bash
cd backend

# (Optional) Create virtual environment
python -m venv venv
# On Windows: venv\Scripts\activate
# On Linux/macOS: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python main.py
```
*API will run at `http://localhost:8000` (Swagger UI at `http://localhost:8000/api/docs`).*

#### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start Vite development server
npm run dev
```
*Application will open at `http://localhost:5173`.*

---

## 🎯 Hackathon Demo Mode (Zero-Config)

NyayaSetu comes with **built-in seed data and pre-analyzed demo documents** so judges and evaluators can experience the entire platform with **ZERO API keys required**:

1. Open `http://localhost:5173`
2. Click **"Try Demo Free"** on the landing page (instant 1-click login)
3. Explore the pre-loaded **Residential Rental Agreement (Harmony Heights)**
4. Test all tabs:
   - **Overview**: Health check, risk flags, financial obligations
   - **Clauses**: Toggle between *Legal*, *Simple*, and *Very Simple*
   - **Obligations**: Toggle statuses between *Pending* and *Completed*
   - **Timeline**: Visual chronological milestone tracker
   - **Legal Lens**: Filter by *Money*, *Deadlines*, *Risk*, *Rights*
   - **Before You Sign**: 5 key pre-signing considerations
5. Click **"Ask Document"** and try questions like:
   - *"What happens if I terminate early?"*
   - *"How much is the security deposit?"*
   - *"What are the late payment penalties?"*
6. Navigate to **Compare Contracts** to see Document A (Rental v1) vs Document B (Leave & License v2) with **Change Impact Analysis**
7. Navigate to **Lawyer Brief** to generate and copy an executive consultation brief

---

## 🛡️ AI Guardrails & Legal Disclaimers

1. **Non-Advisory Mandate**: The AI explicitly states that all insights are informational and not definitive legal advice.
2. **Objective Difference Analysis**: Contract comparisons never proclaim one document "better" or "worse"; rather, they highlight trade-offs.
3. **Grounded Source Attribution**: Every document answer contains verifiable references to exact sections and clauses.
4. **Data Privacy**: No user uploaded documents are ever sent for external model training.

---

## 📂 Project Structure

```
nyayasetu/
├── backend/
│   ├── app/
│   │   ├── api/                     # REST API Routers (auth, documents)
│   │   ├── core/                    # Config, security, JWT
│   │   ├── database/                # SQLAlchemy async session & init
│   │   ├── models/                  # DB ORM Models (User, Document, Analysis, etc.)
│   │   ├── schemas/                 # Pydantic v2 validation models
│   │   └── services/
│   │       ├── ai/                  # LLM Service (Gemini abstraction)
│   │       ├── analysis/            # Health check & legal analysis pipeline
│   │       ├── document_processing/ # Text extraction & chunking
│   │       └── rag/                 # ChromaDB embeddings & retrieval
│   ├── demo_data/                   # Fictional seed documents & analyses
│   ├── main.py                      # FastAPI entrypoint
│   └── requirements.txt             # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable UI & analysis components
│   │   ├── layouts/                 # AppLayout shell with sidebar & header
│   │   ├── pages/                   # Landing, Dashboard, Analysis, Ask, Compare, Brief, Settings
│   │   ├── services/                # Axios API client
│   │   ├── store/                   # Zustand state management
│   │   ├── App.tsx                  # Router & Route guards
│   │   └── main.tsx                 # React DOM mount
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── start.bat                        # 1-Click launcher
└── README.md
```

---

## 📄 License

MIT License. Designed and engineered for legal accessibility and empowerment.
