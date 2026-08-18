from typing import List, Dict

class ReportGenerator:
    def generate_report(self, job_title: str, company: str, risk_score: float, red_flags: List[str], target_platform: str) -> str:
        """
        Creates a structured summary of evidence to be sent to site moderators.
        """
        evidence_str = "\n".join([f"- {flag}" for flag in red_flags])
        
        report = (
            f"URGENT FRAUD TAKEDOWN REQUEST\n"
            f"Platform: {target_platform}\n"
            f"{'='*30}\n"
            f"Job Title: {job_title}\n"
            f"Company (Claimed): {company}\n"
            f"FraudLens Risk Score: {risk_score}/100\n\n"
            f"DETECTED RED FLAGS:\n"
            f"{evidence_str}\n\n"
            f"Action Requested: Please review this posting urgently and remove if confirmed fraudulent."
        )
        return report

reporter = ReportGenerator()
