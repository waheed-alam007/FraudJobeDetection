import sys
sys.path.insert(0, 'backend')
from services.email_service import email_service
from config import settings

print("Testing email service...")
result = email_service.send_fraud_report(
    recipient_email=settings.REPORT_RECIPIENT,
    job_title="Test Job",
    company="Test Company",
    risk_score=92.5,
    red_flags=["Requests wire transfer", "Too good to be true"]
)

print("Status:", result.get("status"))
print("Message:", result.get("message"))
if result.get("status") == "error":
    print("Error Type:", result.get("error_type"))
