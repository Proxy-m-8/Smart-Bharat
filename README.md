# 🇮🇳 Smart Bharat – AI-Powered Civic Companion

> A GenAI-powered civic platform that helps citizens access government services, report public issues, and receive personalized multilingual assistance through an intelligent AI companion.

Built for **PromptWars x Devengers** | Google for Developers | H2S

---

## 📌 Problem Statement

Citizens across India struggle to navigate complex government schemes, track grievances, and access services due to language barriers, low digital literacy, and fragmented information systems. **Smart Bharat** solves this using Generative AI to simplify civic interactions — making them faster, smarter, transparent, and accessible to every citizen, regardless of language or literacy level.

---

## ✨ Key Features

- 🤖 **AI Civic Assistant** – Conversational AI to answer citizen queries and simplify complex government information
- 📋 **Scheme Recommendation Engine** – Personalized government scheme suggestions based on user profile
- 📄 **Document Assistance** – AI-driven checklists, OCR-based verification, and auto-fill support
- 📢 **Grievance Reporting & Tracking** – Report public issues with geo-tagging, AI classification, and real-time status tracking
- 🌐 **Multilingual Support** – Works in all 22 scheduled Indian languages + English (text & voice)
- 🎙️ **Voice-First Access** – Speech-to-text/text-to-speech for low-literacy and accessibility support
- 🔔 **Smart Notifications** – SMS, WhatsApp, and email alerts for deadlines and complaint updates
- 📊 **Transparency Dashboard** – Public, anonymized complaint and service statistics
- 🔐 **Secure Identity Verification** – Aadhaar/DigiLocker-based authentication
- 🏛️ **Admin Portal** – Government-side complaint triage, prioritization, and analytics

---

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **LLM / GenAI** | Google Gemini API |
| **RAG / Vector Store** | Vertex AI Search / FAISS / Pinecone |
| **Translation & Speech** | Bhashini API, IndicTrans2, Google Speech-to-Text/TTS |
| **Backend** | Python (FastAPI) / Node.js microservices |
| **Database** | PostgreSQL, MongoDB |
| **Cloud** | Google Cloud Platform (Cloud Run, BigQuery, Cloud Functions) |
| **Auth** | Aadhaar eKYC, DigiLocker, OAuth2, JWT |
| **OCR / Vision** | Google Vision AI |
| **Messaging** | WhatsApp Business API, Twilio/MSG91 |
| **Geolocation** | Google Maps API |

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.10+ / Node.js 18+
- Docker & Docker Compose
- PostgreSQL & MongoDB instances
- API keys: Gemini API, Bhashini, Google Maps, Google Vision

### Steps
```bash
# Clone the repository
git clone https://github.com/<your-org>/smart-bharat.git
cd smart-bharat

# Install dependencies
pip install -r requirements.txt   # for Python services
npm install                        # for Node services

# Set up environment variables
cp .env.example .env
# Add your API keys and DB credentials in .env

# Run with Docker Compose
docker-compose up --build
```

---

## 🔑 Environment Variables

```env
GEMINI_API_KEY=
BHASHINI_API_KEY=
GOOGLE_MAPS_API_KEY=
GOOGLE_VISION_API_KEY=
DATABASE_URL=
MONGO_URI=
WHATSAPP_API_KEY=
AADHAAR_CLIENT_ID=
JWT_SECRET=
```

---

## 📡 API Overview

| Service | Endpoint | Description |
|---|---|---|
| AI Assistant | `POST /api/chat` | Handles conversational queries |
| Schemes | `GET /api/schemes/recommend` | Returns personalized scheme list |
| Complaints | `POST /api/complaints` | Submit a new grievance |
| Complaints | `GET /api/complaints/:id` | Track complaint status |
| Documents | `POST /api/documents/verify` | OCR-based document validation |
| Translation | `POST /api/translate` | Multilingual translation service |

*(Full API contracts available in `/docs`)*

---

## 🧪 Testing

```bash
pytest tests/          # Python services
npm run test           # Node services
```

---

## 🚀 Roadmap

- [ ] Integrate CPGRAMS API for real government grievance routing
- [ ] Add IVR/USSD support for feature phones
- [ ] Expand offline/low-bandwidth mode
- [ ] Add sentiment analysis for citizen feedback trend

