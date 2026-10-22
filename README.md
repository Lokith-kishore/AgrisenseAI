# AgriSense AI
> **"Smarter Soil. Better Crops. Sustainable Farming."**

AgriSense AI is an enterprise-grade agricultural decision support platform. It analyzes Soil Health Card parameters, computes a normalized **0–100 Soil Health Index**, predicts and ranks suitable crops using multi-model machine learning (**Random Forest with 98.4% accuracy**, XGBoost, etc.), calculates **transparent nutrient deficit fertilizer prescriptions**, provides **Explainable AI (SHAP feature attribution & plain-language farmer reasons)**, powers a **context-aware agronomic chatbot**, enables **side-by-side multi-crop comparison**, tracks **temporal soil trends**, and generates **official printable PDF Soil Health & Advisory Reports**.

---

## 🌟 Key Features

1. **🌾 Automated Soil Health Index (0–100 Score)**:
   - Evaluates 4 weighted diagnostic pillars:
     - **Soil Reaction & Salinity Index (25%)**: pH and Electrical Conductivity (EC).
     - **Primary Macronutrient Index (35%)**: Available Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$).
     - **Organic Matter Index (25%)**: Soil Organic Carbon (SOC %).
     - **Secondary & Micronutrients Index (15%)**: Sulphur, Zinc, Iron, Copper, Manganese, Boron.
   - Categorized into standard ratings: **Excellent (80–100)**, **Good (65–79)**, **Moderate (45–64)**, **Poor (<45)**.

2. **🤖 Multi-Model ML Crop Suitability Recommender**:
   - Benchmarks 5 distinct algorithms on 2,200 multi-crop observations across 22 classes:
     - **Random Forest**: **98.41% Accuracy, 98.42% F1-Score, 100% Top-3 Accuracy**
     - **XGBoost**: **95.91% Accuracy, 95.95% F1-Score, 99.09% Top-3 Accuracy**
     - **K-Nearest Neighbors**: **96.14% Accuracy**
     - **Decision Tree**: **94.77% Accuracy**
     - **Gradient Boosting**: **92.95% Accuracy**
   - Hybrid ranking combines ML probabilities with soil texture compatibility, pH tolerances, and water demand.

3. **🧪 Precision Fertilizer Calculation Engine**:
   - Transparent deficit math: $\Delta \text{Nutrient} = \max(0, \text{Target Demand} - \text{Soil Available Nutrients})$.
   - Accounts for multi-nutrient sources (e.g. deducts $N$ supplied by DAP before computing Urea).
   - Computes exact physical quantities (kg/acre and total field area) for:
     - **Urea (46% N)** with 3-stage split application schedules (Basal, Vegetative, Panicle).
     - **DAP (18:46:0)**, **MOP (60% K2O)**, **SSP (16% P2O5, 11% S)**, **Zinc Sulphate (21% Zn)**.
     - **Soil Amendments**: Agricultural Lime for $\text{pH} < 5.5$, Gypsum for $\text{pH} > 8.2$, Farmyard Manure/Vermicompost for low organic carbon.

4. **🔍 Explainable AI (XAI) with SHAP Attribution**:
   - **Farmer View**: Plain-language agricultural matches (optimal pH zone, nutrient adequacy, moisture alignment).
   - **Technical View**: Dynamic feature contribution breakdown showing percentage impacts of Rainfall, Humidity, N, P, K, pH, and Temperature.

5. **📊 Interactive Multi-Crop Radar Comparison**:
   - Compare up to 5 crops side-by-side with interactive Recharts radar diagrams and N-P-K demand bars.

6. **📈 Temporal Soil Quality & Trend Tracking**:
   - Interactive time-series charts (1m, 3m, 6m, 1y, all-time) for Soil Health Score, pH, Nitrogen, Phosphorus, Potassium, and Organic Carbon.

7. **📁 Batch Soil Health Card Upload & Auto-Mapper**:
   - Upload `.csv` and `.xlsx` files with fuzzy alias detection (`N`, `available_n`, `Nitrogen`, `pH`, `OC`, `SOC`).
   - Automated data quality analysis (missing cells, row counts, duplicate checks).

8. **📄 Publication-Quality PDF Advisory Reports**:
   - Download official styled Soil Health Cards with farmer identifiers, health scorecard, parameter diagnostic matrix, top crops, and fertilizer schedules.

9. **💬 Context-Grounded AI Agricultural Assistant**:
   - Conversational chatbot grounded strictly in the farmer's active soil test data and crop requirements.

10. **🛡️ Admin Command Center & Model Telemetry**:
    - Live system statistics, user management, real confusion matrix visualization, benchmark comparison table, and master crop database CRUD.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts, jsPDF.
- **Backend API**: Node.js, Express, TypeScript, SQLite relational database (with automated migrations & seeders), JWT Authentication, bcryptjs, Multer, PDFKit.
- **ML Microservice**: Python 3.12, FastAPI, Uvicorn, Scikit-Learn, XGBoost, Pandas, NumPy, SHAP.

---

## 🚀 Quick Start Guide

### 1. Default Demo Credentials
- **Demo Farmer**: `farmer@agrisense.ai` / `Farmer@123`
- **Demo Admin**: `admin@agrisense.ai` / `Admin@123`
*(Note: You can also use the one-click "Demo Farmer" and "Demo Admin" fast-login buttons on the Sign In page!)*

### 2. Running the ML Microservice (FastAPI)
```bash
cd ml
python api/main.py
# Runs on http://localhost:8000
```

### 3. Running the Backend API (Node.js / Express)
```bash
cd backend
npm install
npm run build
npm start
# Runs on http://localhost:5000
```

### 4. Running the Frontend UI (React / Vite)
```bash
cd frontend
npm install
npm run dev
# Accessible at http://localhost:3000
```

---

## 📡 REST API Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new farmer account
- `POST /api/auth/login` — Sign in and obtain JWT
- `GET /api/auth/me` — Retrieve active profile session

### Fields (`/api/fields`)
- `GET /api/fields` — List farmer farm plots
- `POST /api/fields` — Create a new field parcel
- `PUT /api/fields/:id` — Update field metadata
- `DELETE /api/fields/:id` — Delete field parcel

### Soil Diagnostics (`/api/soil`)
- `POST /api/soil/analyze` — Run comprehensive soil health and ML crop analysis
- `POST /api/soil/upload` — Ingest and auto-map CSV / XLSX Soil Health Cards
- `GET /api/soil/history` — Retrieve temporal soil test logs with filters
- `GET /api/soil/:id` — Get specific historical analysis with recommendations

### AI & Agronomy (`/api/ai`)
- `POST /api/ai/crop-recommendation` — Predict top ranked crops
- `POST /api/ai/fertilizer-recommendation` — Compute area-adjusted fertilizer prescription
- `POST /api/ai/soil-health` — Calculate 0–100 Soil Health Index
- `POST /api/ai/explanation` — Generate dual-layer SHAP and farmer explanations
- `POST /api/ai/chat` — Context-grounded conversational AI assistant
- `GET /api/ai/crops` — Master crop knowledge base
- `POST /api/ai/compare-crops` — Multi-crop radar comparison

### Reports (`/api/reports`)
- `GET /api/reports/:id` — Stream downloadable official PDF Soil Health Report

### Administration (`/api/admin`)
- `GET /api/admin/statistics` — Live platform analytics
- `GET /api/admin/users` — User management directory
- `GET /api/admin/model-performance` — Multi-model benchmarks and confusion matrix
- `POST /api/admin/crops` — Add crop to master knowledge base
- `POST /api/admin/fertilizers` — Add fertilizer specification

---

## 🛡️ Agricultural Advisory Disclaimer
Fertilizer recommendations and crop suitability rankings generated by AgriSense AI are decision-support estimates calibrated on regional agronomic benchmarks and Soil Health Card guidelines. Actual field applications should be verified with local agricultural extension officers, Krishi Vigyan Kendras (KVK), or certified agronomists.
