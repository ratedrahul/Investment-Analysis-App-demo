# Investment Fund Analysis

A full-stack application that identifies the most consistent investment funds by analysing the volatility of their monthly returns, and provides an interactive React dashboard for visualisation and financial planning.

## Project Overview

The backend ingests a dataset of 100 investment funds, each with 12 months of return percentages. It computes statistical metrics for every fund, ranks them by consistency, and exposes the results through a RESTful API. The frontend consumes those APIs and renders the data as tables, charts, and an interactive financial goal calculator.

## Consistency Metric

Consistency is measured using the **standard deviation** (population) of a fund's 12 monthly returns.

- A **lower** standard deviation means returns stay close to the average month after month — the fund is *more consistent*.
- A **higher** standard deviation means returns swing widely — the fund is *more volatile*.

The top-ranked funds are those with the smallest standard deviation, indicating the most predictable performance over the observation period.

## Architecture

```
investment-analysis-app/
├── backend/                          # Django + DRF API
│   ├── investment_project/           # Project settings & root URLs
│   ├── funds/                        # Funds app
│   │   ├── services/
│   │   │   ├── analysis.py           # Statistical analysis logic
│   │   │   └── dataset_generator.py  # Synthetic dataset creation
│   │   ├── views.py                  # API views (cached)
│   │   ├── serializers.py            # DRF serializers
│   │   └── urls.py                   # Route definitions
│   └── data/
│       ├── funds.csv                 # Generated dataset
│       └── generate_funds.py         # Standalone generation script
├── frontend/                         # React + Vite
│   └── src/
│       ├── pages/
│       │   └── Dashboard.jsx         # Main dashboard page
│       ├── components/
│       │   ├── TopFundsTable.jsx      # Top 3 consistent funds
│       │   ├── VolatilityChart.jsx    # Bar chart comparison
│       │   ├── FundRankingsTable.jsx  # Full rankings with drill-down
│       │   ├── FundDetailView.jsx     # Single-fund detail + chart
│       │   └── GoalMonthsCalculator.jsx  # Financial goal simulator
│       └── services/
│           └── api.js                # Axios API client
└── README.md
```

**Backend** — Django REST Framework serves the analysis API. Business logic lives in `funds/services/`, views are thin wrappers, and results are cached in-memory for 60 seconds (automatically cleared on dataset regeneration).

**Frontend** — React (Vite) dashboard with Recharts for data visualisation and Axios for API communication. The Vite dev server proxies `/api` requests to Django.

## Features

- **Dataset Generation** — Create a synthetic dataset of 100 funds with realistic return distributions (low / medium / high volatility tiers), via API or standalone script.
- **Fund Consistency Analysis** — Compute average return and standard deviation for each fund; identify the top 3 most consistent performers.
- **Volatility Rankings** — Rank all 100 funds by consistency with an interactive, clickable table.
- **Fund Detail View** — Drill into any fund to see a monthly returns line chart and breakdown table.
- **Interactive Charts** — Volatility comparison bar chart, monthly returns line chart with average reference line.
- **Financial Goal Calculator** — Simulate month-by-month compound growth with configurable goal, contribution, and interest rate; displays a projection chart and balance table.
- **CSV Export** — Download the full rankings as a CSV file.
- **API Documentation** — Auto-generated Swagger UI powered by drf-spectacular.

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```

The API is available at http://localhost:8000/api/.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The dashboard is available at http://localhost:5173/.

### Generate a New Dataset

Option 1 — via API (while the server is running):

```bash
curl -X POST http://localhost:8000/api/funds/generate-dataset/
```

Option 2 — via standalone script:

```bash
cd backend
python3 data/generate_funds.py
```

Both methods write to `backend/data/funds.csv`.

### API Documentation

Start the backend server, then open:

- **Swagger UI** — http://localhost:8000/api/docs/
- **OpenAPI Schema** — http://localhost:8000/api/schema/

## API Endpoints

| Method | Endpoint | Description |
|--------|--------------------------------------|----------------------------------------------|
| GET | `/api/` | API root — lists all endpoints |
| GET | `/api/health/` | Health check |
| GET | `/api/funds/top-consistent/` | Top 3 most consistent funds |
| GET | `/api/funds/all/` | All funds with metrics |
| GET | `/api/funds/rankings/` | All funds ranked by consistency |
| GET | `/api/funds/<fund_name>/` | Detail for a single fund |
| POST | `/api/funds/generate-dataset/` | Generate a new 100-fund dataset |
| GET | `/api/funds/export/` | Download rankings as CSV |
| GET | `/api/schema/` | OpenAPI 3.0 schema |
| GET | `/api/docs/` | Swagger UI |

## Tech Stack

| Layer | Technologies |
|----------|----------------------------------------------|
| Backend | Django 4.2, Django REST Framework, drf-spectacular, pandas |
| Frontend | React 18, Vite, Axios, Recharts |
| Caching  | Django LocMemCache (60s TTL) |
