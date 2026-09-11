# 🌊 AAPADMITRA

## AI-Powered Flood Prediction & Emergency Response System

⚠️ **Synthetic-Data TRL-4 Prototype** — Not validated on real IMD/CWC data

---

## 🎯 Problem

Floods affect **1.81 billion people** globally and account for **43% of all natural disasters**. In Assam alone, **1.4 million people** were displaced in 2022, with over **600 lives lost** and **₹3.4 billion** in economic damage.

Existing systems fail because:
- ❌ **No village-level prediction** — CWC predicts at station level
- ❌ **No uncertainty information** — IMD gives binary warnings
- ❌ **No action plan** — ASDMA reacts after floods
- ❌ **No explainability** — Systems are black boxes

---

## 💡 Solution

**Aapadmitra** predicts village-level flood risk **24–72 hours in advance** with confidence intervals, SHAP explainability, and **12 integrated emergency response modules** — from prediction to action.

---

## 🧩 12 Modules

| # | Module | Function |
|---|--------|----------|
| 1 | Sanket | Flood risk prediction with confidence |
| 2 | Marg | Safe evacuation route |
| 3 | Sahay | Rescue team assignment |
| 4 | Rahat | Relief allocation |
| 5 | Smriti | Historical events |
| 6 | SetuCore | Incident engine |
| 7 | Chetna | Ground reports |
| 8 | Sahayak | Volunteer coordination |
| 9 | Awaaz | Multi-language alerts |
| 10 | Punarvas | Recovery tracking |
| 11 | Disha | What-if simulator |
| 12 | Drishti | Command dashboard |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Python 3.12, FastAPI, Pydantic |
| **Frontend** | React, Vite, Recharts, Axios |
| **ML** | PyTorch, XGBoost, Scikit-learn |
| **Explainability** | SHAP-based feature importance |
| **Deployment** | Docker, Docker Compose |
| **Testing** | Pytest |

---

## 📊 Model Performance

| Model | Accuracy | F1-Score | ROC-AUC |
|-------|----------|----------|---------|
| Logistic Regression | 59.19% | 58.22% | 62.91% |
| Random Forest | 56.71% | 55.57% | 60.75% |
| XGBoost | 57.19% | 56.07% | 59.40% |
| **Physics-Guided MLP** | **57.83%** | **58.81%** | **59.61%** |

### Validation Results

| Test | Accuracy | F1-Score |
|------|----------|----------|
| Temporal Validation | 57.19% | 56.07% |
| Cross-District Validation | 58.33% | 57.98% |
| **Extreme Event (95th percentile)** | **63.66%** | **76.01%** |

**Key Insight:** Model performs best on extreme events — critical for flood prediction.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- Docker (optional)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
Backend runs on: http://localhost:8000

Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs on: http://localhost:5173

Docker Setup
docker-compose up --build

📁 Project Structure

aapadmitra/
│
├── data/
│   ├── raw/              # 14 synthetic CSV files
│   ├── processed/        # Feature store
│   └── demo/             # Runtime fixtures
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/          # 12 module APIs
│   │   ├── services/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── utils/
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── pages/        # 12 module pages
│   │   ├── components/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── Dockerfile
│
├── ml/
│   ├── data_generation/
│   ├── feature_engineering/
│   ├── training/
│   ├── evaluation/
│   ├── explainability/
│   └── artifacts/        # Saved models
│
├── results/
│   ├── figures/          # SHAP plots, validation charts
│   ├── tables/
│   └── metrics/          # CSV results
│
├── docs/
│   ├── paper/
│   ├── architecture/
│   └── api/
│
├── docker-compose.yml
├── README.md
├── .gitignore
└── LICENSE

🧪 Testing

cd backend
python -m pytest tests/ -v
9/9 tests passing ✅

📊 Data
14 Synthetic Datasets
rainfall_data.csv

water_level_data.csv

topography_data.csv

landcover_data.csv

historical_flood_data.csv

village_demographics.csv

soil_data.csv

river_data.csv

infrastructure_data.csv

rescue_resources.csv

weather_forecast_data.csv

predictions.csv

station_master_reference.csv

cwc_station_reference.csv

Feature Store
flood_training_feature_store.csv — 7,512 rows

Train: 5,008 | Validation: 1,252 | Test: 1,252

Labels: Balanced (50/50 split)

🔬 Research Backing
Aapadmitra addresses gaps identified in 7+ peer-reviewed papers:

Paper	Key Insight
Mosavi et al. (2018)	ML outperforms conventional models
Raissi et al. (2019)	PINNs = Physics + ML
Ren et al. (2025)	PINNs evolution
Peng et al. (2025)	Uncertainty is critical
Kumar et al. (2026)	SHAP validates interpretability
Rijal et al. (2026)	Hybrid AI-physics recommended
Arinze et al. (2025)	End-to-end systems validated

🏆 Competitive Advantages

Feature	Existing	Aapadmitra
Level	District/Station	Village-Level ✅
Uncertainty	❌ None	Confidence Intervals ✅
Action Plan	❌ None	12 Modules ✅
Physics	❌ None	Physics-Guided MLP ✅
Explainability	❌ None	Feature Importance ✅
End-to-End	❌ None	Prediction → Action ✅

📅 Built For
SIH 2026 — Smart India Hackathon

Team: 6 Members
Deadline: 16 September 2026

🗺️ Post-Hackathon Roadmap
Phase	Timeline	Activity
Phase 1	1-3 Months	Real data integration (IMD/CWC)
Phase 2	3-6 Months	Pilot in 1 Assam district
Phase 3	6-12 Months	Scale with ASDMA

👤 License
MIT

🙏 Acknowledgments
Built as a research prototype exploring physics-guided machine learning for flood prediction. All data is synthetic and created for research purposes.

Last Updated: 11 September 2026
