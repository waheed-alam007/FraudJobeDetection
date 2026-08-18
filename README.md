---
title: FraudLens Backend
emoji: 🕵️
colorFrom: yellow
colorTo: gray
sdk: docker
pinned: false
app_port: 7860
---

# FraudLens - AI Job Fraud Detection & Reporting System

🚨 **Live Demo**: _(add your Vercel URL here after deployment)_  
🔧 **Backend API**: _(add your Hugging Face Space URL here after deployment)_

## Overview

**[FraudLens](http://localhost:5173/)** is a full-stack AI-powered job fraud detection system that analyzes job postings for red flags and automatically sends fraud alerts to moderators via email.

### Key Features
- ✅ **AI Fraud Detection**: BiLSTM model detects fake job postings by analyzing descriptions and metadata
- ✅ **Real-time Analysis**: Instant risk scoring (0-100) with explainable red flags
- ✅ **Automated Reporting**: One-click fraud report sending via Gmail SMTP
- ✅ **Evidence Visualization**: Interactive UI showing fraud indicators
- ✅ **Production-Ready**: Docker deployment, environment-based secrets, structured logging.

## Tech Stack

### Backend
- **FastAPI** - High-performance async API framework
- **Uvicorn** - ASGI server
- **SQLAlchemy** - ORM for data persistence
- **NLTK** - NLP preprocessing
- **python-dotenv** - Secure credential management

### Frontend
- **React 18** - UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Icon library
- **Framer Motion** - Smooth animations

### Deployment
- **Docker** - Container orchestration
- **Hugging Face Spaces** - Backend hosting
- **Vercel** - Frontend hosting

## Quick Start

### Local Development

#### Prerequisites
- Python 3.11+
- Node.js 16+
- Docker (optional)

#### Using Docker (Recommended)

```bash
# Clone repository here .
git clone <repo-url>
cd  FAKEJOBDETECTION.

# Copy environment template
cp backend/.env.example backend/.env

# Edit .env with your Gmail credentials
# Get App Password from https://myaccount.google.com/apppasswords
vim backend/.env

# Start both services
docker-compose up --build
```

Backend: http://localhost:8000  
Frontend: http://localhost:5173  
API Docs: http://localhost:8000/docs

#### Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python -m uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Configuration

### Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
# Gmail SMTP Configuration
EMAIL_SENDER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # 16-char App Password

# Fraud Report Configuration
REPORT_RECIPIENT=admin@example.com

# Application
ENVIRONMENT=development
DEBUG=False
```

### Getting Gmail App Password

1. Enable 2-Factor Authentication: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password to `EMAIL_PASSWORD`

## API Documentation

### Analyze Job Posting

```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Developer",
    "company": "TechCorp",
    "description": "Send wire transfer to start work...",
    "requirements": "5+ years experience",
    "benefits": "$500k/year remote",
    "has_company_logo": false,
    "telecommuting": true
  }'
```

**Response:**
```json
{
  "is_fraud": true,
  "risk_score": 92.5,
  "red_flags": ["Requests wire transfer", "Too good to be true"],
  "feature_importance": {"description_weight": 0.8, "telecommuting_weight": 0.2}
}
```

### Report Fraud Incident

```bash
curl -X POST http://localhost:8000/api/report-incident \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Senior Developer",
    "company": "TechCorp",
    "risk_score": 92.5,
    "red_flags": ["Requests wire transfer", "Too good to be true"],
    "target_platform": "email"
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "Fraud report sent successfully",
  "email_sent_to": "admin@example.com"
}
```

### Trending Data

```bash
curl http://localhost:8000/api/global-trends
```

## Deployment

### Deploy Backend to Hugging Face Spaces

1. Create account at https://huggingface.co
2. Create new Space with Docker runtime
3. Connect your GitHub repo or upload files
4. Add Secrets:
   - `EMAIL_SENDER`
   - `EMAIL_PASSWORD`
   - `REPORT_RECIPIENT`
5. Deploy automatically from main branch

### Deploy Frontend to Vercel

1. Create account at https://vercel.com
2. Import project from GitHub
3. Set environment variables:
   - `VITE_API_URL=https://your-hf-space-url`
4. Deploy

### Deploy Frontend to Netlify

1. Create account at https://netlify.com
2. Connect GitHub repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-hf-space-url`
6. Deploy

## Project Structure

```
fake_job_detection/
├── backend/
│   ├── main.py                 # FastAPI app
│   ├── config.py              # Configuration management
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment template
│   └── services/
│       ├── analyzer.py        # Fraud detection logic
│       ├── reporter.py        # Report generation
│       └── email_service.py   # Email sending
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── components/       # React components
│   │   ├── store/            # State management
│   │   └── index.css         # Tailwind styles
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
├── Dockerfile                 # Backend container
├── docker-compose.yml         # Multi-container setup
├── .dockerignore
├── .gitignore
└── README.md
```

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test

# End-to-end tests
npm run test:e2e
```

## Performance Metrics

| Metric | Value |
|--------|-------|
| API Response Time | ~50-100ms |
| Fraud Detection Accuracy (Mock) | 95% |
| Email Delivery Time | <5s |
| Frontend Build Time | ~2s |
| Backend Cold Start | ~2s |

## Security

✅ Environment-based secrets management  
✅ CORS enabled for frontend access  
✅ Input validation on all endpoints  
✅ No credentials in source code  
✅ Structured logging for debugging  
✅ HTTPS enforced in production  

## Future Enhancements

- [ ] Real ML model training pipeline
- [ ] Database persistence (Postgres)
- [ ] Admin dashboard for report management
- [ ] User authentication & roles (JWT)
- [ ] Rate limiting & abuse prevention
- [ ] Multi-language support
- [ ] Email templates (HTML)
- [ ] Webhook integrations
- [ ] Monitoring & alerting (Sentry, Prometheus)
- [ ] GraphQL API option

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b updated/your-updated`
3. Commit changes: `git commit -m 'Add updated'`
4. Push to branch: `git push origin updated/your-updated`
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Author

**Waheed**  
📧 waeed3203@gmail.com  
🔗 [GitHub](https://github.com/waheed-alam007) | [Portfolio](https://portfolio.com)

---

**Questions?** Open an issue or reach out via email.
