import React, { useState } from 'react';
import { Send, Copy, CheckCircle2, AlertCircle, ScrollText } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ActionCenter({ result, jobPosting }) {
  const [copied, setCopied] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportStatus, setReportStatus] = useState(null);

  const reportText = `FRAUD REVIEW REQUEST\n\nFraudLens AI assessed this posting at a Risk Score of ${result.risk_score}/100.\n\nFINDINGS:\n${result.red_flags.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nRequesting review and takedown if confirmed fraudulent.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReportToPlatform = async () => {
    setReporting(true);
    setReportStatus(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_URL}/api/report-incident`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_title: jobPosting?.title || 'Unknown',
          company: jobPosting?.company || 'Unknown',
          risk_score: result.risk_score,
          red_flags: result.red_flags,
          target_platform: 'email'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        setReportStatus({
          type: 'success',
          message: 'Report filed with our moderation team.'
        });
        setTimeout(() => setReportStatus(null), 5000);
      } else {
        setReportStatus({
          type: 'error',
          message: data.detail?.message || data.detail || 'Failed to file report.'
        });
      }
    } catch (error) {
      setReportStatus({
        type: 'error',
        message:
          error.name === 'AbortError'
            ? 'Request timed out. The service may be waking up — try again shortly.'
            : `Could not reach the service: ${error.message}`
      });
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="paper-panel rounded-lg p-7 sm:p-8">
      <div className="flex items-center gap-2.5 mb-2">
        <ScrollText className="text-brass w-5 h-5" strokeWidth={1.75} />
        <h3 className="font-display text-xl font-medium text-ink">Incident Report</h3>
      </div>
      <p className="text-inkMuted text-sm mb-5 leading-relaxed">
        This posting was flagged as fraudulent. File a report to notify moderators, or copy it for your own records.
      </p>

      <div className="bg-void/60 rounded border border-panelBorder p-4 font-mono text-xs text-inkMuted mb-5 h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed">
        {reportText}
      </div>

      {reportStatus && (
        <div
          className={`mb-4 p-3.5 rounded flex items-center gap-2.5 text-sm ${
            reportStatus.type === 'success'
              ? 'bg-safe/10 border border-safe/40 text-safe'
              : 'bg-risk/10 border border-risk/40 text-risk'
          }`}
        >
          {reportStatus.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{reportStatus.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 bg-void/60 hover:bg-void text-ink py-2.5 px-4 rounded border border-panelBorder transition-colors text-sm font-medium"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-safe" /> : <Copy className="w-4 h-4 text-inkMuted" />}
          {copied ? 'Copied' : 'Copy Report'}
        </button>
        <button
          onClick={handleReportToPlatform}
          disabled={reporting}
          className="flex items-center justify-center gap-2 bg-risk hover:bg-risk/90 disabled:opacity-50 disabled:cursor-not-allowed text-paper font-semibold py-2.5 px-4 rounded transition-colors text-sm"
        >
          <Send className="w-4 h-4" />
          {reporting ? 'Filing…' : 'File Report'}
        </button>
      </div>
    </div>
  );
}
