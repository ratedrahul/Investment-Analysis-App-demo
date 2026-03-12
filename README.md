# Investment Analysis Application

Full-stack application for analyzing investment fund consistency using monthly returns data.

## Project Structure

```
investment-analysis-app/
├── backend/                  # Django + DRF API
│   ├── investment_project/   # Django project settings
│   ├── funds/                # Funds analysis app
│   │   └── services/        # Business logic layer
│   └── data/                 # CSV data files
├── frontend/                 # React + Vite UI
│   └── src/
│       ├── pages/            # Page components
│       ├── components/       # Reusable UI components
│       └── services/         # API client
└── README.md
```

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:5173/`.

## Tech Stack

- **Backend:** Django, Django REST Framework, pandas
- **Frontend:** React, Vite, Axios, Recharts
