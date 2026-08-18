from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import logging
import json
from sqlalchemy.orm import Session
from sqlalchemy import func
from services.analyzer import analyzer
from services.reporter import reporter
from services.email_service import email_service
from config import settings
from database.db import init_db, get_db
from database.models import FraudIncident

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FraudLens API", description="AI Job Fraud Detection & Reporting System")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Log startup
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 FraudLens API starting up...")
    logger.info(f"✓ CORS enabled for all origins")
    logger.info(f"✓ Email service initialized")
    init_db()

class JobPosting(BaseModel):
    title: str
    company: str
    description: str
    requirements: str = ""
    benefits: str = ""
    has_company_logo: bool = False
    telecommuting: bool = False
    url: Optional[str] = None

class AnalysisResult(BaseModel):
    is_fraud: bool
    risk_score: float
    red_flags: List[str]
    feature_importance: dict

class ReportRequest(BaseModel):
    job_title: str
    company: str
    risk_score: float
    red_flags: List[str]
    target_platform: str

@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze_job(posting: JobPosting, db: Session = Depends(get_db)):
    result = analyzer.analyze_posting(
        posting.description, 
        posting.requirements, 
        posting.benefits, 
        posting.has_company_logo,
        posting.telecommuting
    )

    # Log to incident database if flagged as fraud
    if result["is_fraud"]:
        try:
            incident = FraudIncident(
                target_url=posting.url,
                risk_score=result["risk_score"],
                red_flags=json.dumps(result["red_flags"]),
                company_name=posting.company,
                job_title=posting.title,
            )
            db.add(incident)
            db.commit()
            logger.info(f"✓ Fraud incident logged: {posting.company} - {posting.title}")
        except Exception as e:
            db.rollback()
            logger.error(f"❌ Failed to log fraud incident: {e}")

    return result

@app.post("/api/report-incident")
async def generate_fraud_report(request: ReportRequest):
    try:
        logger.info(f"📧 Fraud report request received for: {request.company} - {request.job_title}")
        logger.info(f"   Risk Score: {request.risk_score}")
        logger.info(f"   Recipient: {settings.REPORT_RECIPIENT}")

        # Send email to the fraud detection team
        logger.info("🔄 Calling email service...")
        email_result = email_service.send_fraud_report(
            recipient_email=settings.REPORT_RECIPIENT,
            job_title=request.job_title,
            company=request.company,
            risk_score=request.risk_score,
            red_flags=request.red_flags
        )

        logger.info(f"📤 Email service response: {email_result['status']}")

        if email_result["status"] == "success":
            logger.info(f"✓ Email sent successfully to {email_result['recipient']}")
            return {
                "status": "success",
                "message": "Fraud report sent successfully",
                "email_sent_to": email_result["recipient"]
            }
        else:
            logger.error(f"✗ Email failed: {email_result['message']}")
            # Return error_type and message for better debugging
            raise HTTPException(
                status_code=500,
                detail={
                    "error_type": email_result.get("error_type", "unknown_error"),
                    "message": email_result.get("message", "Unknown error")
                }
            )
    except Exception as e:
        logger.error(f"✗ Unexpected error in report endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "exception",
                "message": str(e)
            }
        )

@app.get("/api/global-trends")
async def get_global_trends(db: Session = Depends(get_db)):
    """Returns real fraud trend stats computed from logged incidents."""
    total_incidents = db.query(func.count(FraudIncident.id)).scalar() or 0

    # Aggregate red flag frequency across all logged incidents to
    # approximate which "categories" are most targeted, since the
    # current schema doesn't store an explicit industry field.
    flag_counts = {}
    rows = db.query(FraudIncident.red_flags).all()
    for (flags_json,) in rows:
        try:
            flags = json.loads(flags_json) if flags_json else []
        except (json.JSONDecodeError, TypeError):
            flags = []
        for flag in flags:
            flag_counts[flag] = flag_counts.get(flag, 0) + 1

    return {
        "targeted_industries": flag_counts,
        "recent_incidents": total_incidents
    }
