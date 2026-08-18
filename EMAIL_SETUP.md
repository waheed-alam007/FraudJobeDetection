# Email Configuration for Fraud Report Sending

To enable the "Report to Platform" button to send emails, you need to configure your Gmail credentials.

## Setup Instructions

1. **Enable 2-Factor Authentication on your Gmail account** (if not already enabled)
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate an App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password

3. **Update the Email Service Configuration**
   - Edit `backend/services/email_service.py`
   - Replace the credentials on line 6:
     ```python
     def __init__(self, sender_email: str = "waeed3203@gmail.com.com", sender_password: str = "your-app-password"):
     ```
   - Example (don't share this publicly):
     ```python
     def __init__(self, sender_email: str = "waeed3203@gmail.com.com", sender_password: str = "abcd efgh ijkl mnop"):
     ```

## How It Works

When someone clicks the "Report to Platform" button:

1. The frontend sends the fraud details (job title, company, risk score, red flags) to the backend
2. The backend creates a formatted email with the fraud alert
3. The email is sent to the address set in `REPORT_RECIPIENT` (your `.env` file)
4. The user receives confirmation that the report was sent

## Email Format

The email includes:
- Subject: `🚨 URGENT: Fake Job Posting Alert - [Company] ([Job Title])`
- Body with:
  - Job posting details
  - Detected red flags
  - Risk score (0-100)
  - Action required notice

## Testing

1. Start the backend server
2. Open the frontend
3. Submit a job posting that triggers fraud detection
4. Click "Report to Platform"
5. Check the inbox set in `REPORT_RECIPIENT` for the email

## Security Notes

- **Never commit** your credentials to version control
- Use environment variables in production (see .env.example)
- Consider using a dedicated email account for reports
- The 16-character App Password is safer than using your actual Gmail password
