import React from 'react';
import RiskMeter from './RiskMeter';
import { Stamp, AlertTriangle, ListChecks } from 'lucide-react';

export default function EvidenceWall({ result, isAnalyzing, error }) {
  if (error) {
    return (
      <div className="paper-panel rounded-lg p-8 border-l-4 border-l-risk">
        <div className="flex items-center gap-2.5 mb-3">
          <AlertTriangle className="text-risk w-5 h-5" strokeWidth={1.75} />
          <h2 className="font-display text-lg font-medium text-ink">Review Failed</h2>
        </div>
        <p className="font-mono text-xs text-inkMuted leading-relaxed">{error}</p>
      </div>
    );
  }

  if (!result && !isAnalyzing) {
    return (
      <div className="paper-panel rounded-lg p-8 h-full min-h-[280px] flex items-center justify-center flex-col text-inkMuted/60">
        <Stamp className="w-12 h-12 mb-3 opacity-40" strokeWidth={1} />
        <p className="font-mono text-xs uppercase tracking-widest text-center">
          Awaiting case submission
        </p>
      </div>
    );
  }

  return (
    <div
      className={`paper-panel rounded-lg p-7 sm:p-8 transition-colors duration-500 ${
        result?.is_fraud ? 'border-l-4 border-l-risk' : result ? 'border-l-4 border-l-safe' : ''
      }`}
    >
      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-panelBorder">
        <Stamp className="text-brass w-5 h-5" strokeWidth={1.75} />
        <h2 className="font-display text-xl font-medium text-ink">Verdict</h2>
      </div>

      <div className="flex justify-center mb-8">
        <RiskMeter score={result?.risk_score || 0} isFraud={result?.is_fraud} isAnalyzing={isAnalyzing} />
      </div>

      {result && (
        <div className="tick-in">
          <h3 className="flex items-center gap-2 text-xs uppercase text-inkMuted font-mono mb-4 tracking-wider">
            <ListChecks className="w-3.5 h-3.5" />
            Findings
          </h3>
          {result.red_flags.length > 0 ? (
            <ul className="space-y-2.5">
              {result.red_flags.map((flag, idx) => (
                <li
                  key={idx}
                  className="bg-void/50 border border-panelBorder rounded px-3.5 py-2.5 flex items-start gap-2.5 text-inkMuted text-sm"
                >
                  <span className="font-mono text-[10px] text-risk mt-0.5 flex-shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-ink/90">{flag}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-void/50 border border-panelBorder rounded px-3.5 py-3 text-safe text-sm">
              No red flags detected — posting reads as legitimate.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
