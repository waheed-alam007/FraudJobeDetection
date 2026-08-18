#!/usr/bin/env python3
"""Test email sending functionality"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from services.email_service import email_service
from config import settings

print("=" * 60)
print("EMAIL SERVICE TEST")
print("=" * 60)

# Check configuration
print(f"\n✓ EMAIL_SENDER: {settings.EMAIL_SENDER}")
print(f"✓ EMAIL_PASSWORD: {'SET' if settings.EMAIL_PASSWORD else 'NOT SET'}")
print(f"✓ EMAIL_SMTP_SERVER: {settings.EMAIL_SMTP_SERVER}")
print(f"✓ EMAIL_SMTP_PORT: {settings.EMAIL_SMTP_PORT}")
print(f"✓ REPORT_RECIPIENT: {settings.REPORT_RECIPIENT}")

# Test email sending
print("\n" + "=" * 60)
print("Sending test email...")
print("=" * 60)

result = email_service.send_fraud_report(
    recipient_email=settings.REPORT_RECIPIENT,
    job_title="Test Job Title",
    company="Test Company",
    risk_score=95.5,
    red_flags=["Test flag 1", "Test flag 2", "Test flag 3"]
)

print(f"\nResult: {result['status']}")
print(f"Message: {result['message']}")

if result['status'] == 'success':
    print("\n✓ EMAIL SENT SUCCESSFULLY!")
else:
    print(f"\n✗ EMAIL FAILED: {result['message']}")

print("=" * 60)
