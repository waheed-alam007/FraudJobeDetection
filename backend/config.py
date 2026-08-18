import os
from dotenv import load_dotenv
import logging

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)

class Settings:
    """Application configuration loaded from environment variables."""
    
    # Email Configuration
    EMAIL_SENDER = os.getenv("EMAIL_SENDER")
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
    EMAIL_SMTP_SERVER = os.getenv("EMAIL_SMTP_SERVER", "smtp.gmail.com")
    EMAIL_SMTP_PORT = int(os.getenv("EMAIL_SMTP_PORT", "587"))
    
    # Report Configuration
    REPORT_RECIPIENT = os.getenv("REPORT_RECIPIENT", "")

    # Database Configuration
    # Defaults to local SQLite so the app runs without extra setup.
    # Set DATABASE_URL in .env to point to Postgres/MySQL/etc for production.
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sentinel.db")
    
    # App Configuration
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    
    @classmethod
    def validate(cls):
        """Validate that required environment variables are set."""
        required = ["EMAIL_SENDER", "EMAIL_PASSWORD"]
        missing = [var for var in required if not os.getenv(var)]
        return len(missing) == 0
    
    @classmethod
    def log_config(cls):
        """Log configuration for debugging (without revealing passwords)."""
        if cls.EMAIL_SENDER:
            logger.info(f"✓ Email Sender: {cls.EMAIL_SENDER}")
        else:
            logger.warning(f"⚠ Email Sender: NOT SET")
            
        if cls.EMAIL_PASSWORD:
            logger.info(f"✓ Email Password: {'*' * 8}")
        else:
            logger.warning(f"⚠ Email Password: NOT SET")
            
        logger.info(f"✓ Email SMTP Server: {cls.EMAIL_SMTP_SERVER}")
        logger.info(f"✓ Email SMTP Port: {cls.EMAIL_SMTP_PORT}")
        logger.info(f"✓ Report Recipient: {cls.REPORT_RECIPIENT or 'NOT SET'}")
        logger.info(f"✓ Database: {cls.DATABASE_URL.split('://')[0]}")
        logger.info(f"✓ Environment: {cls.ENVIRONMENT}")

settings = Settings()

# Log configuration on load
settings.log_config()

# Check if email is properly configured
if settings.validate():
    logger.info("✓ Email configuration is VALID")
else:
    logger.warning("⚠ Email configuration INCOMPLETE - emails may not send")
