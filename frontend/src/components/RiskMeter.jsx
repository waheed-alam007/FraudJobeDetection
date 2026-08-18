import React from 'react';

export default function RiskMeter({ score, isFraud, isAnalyzing }) {
  const tone = isAnalyzing
    ? { ring: 'border-inkMuted/30', text: 'text-inkMuted', label: 'PENDING' }
    : isFraud
    ? { ring: 'border-risk', text: 'text-risk', label: 'FRAUD RISK' }
    : { ring: 'border-safe', text: 'text-safe', label: 'VERIFIED SAFE' };

  return (
    <div className="flex flex-col items-center">
      <div
        key={isAnalyzing ? 'pending' : `${score}-${isFraud}`}
        className={`relative w-40 h-40 rounded-full border-4 ${tone.ring} flex flex-col items-center justify-center -rotate-3 ${!isAnalyzing ? 'stamp-in' : ''}`}
      >
        <div className={`absolute inset-[6px] rounded-full border border-dashed ${tone.ring} opacity-60`}></div>
        <span className={`font-display text-4xl font-semibold ${tone.text} leading-none`}>
          {isAnalyzing ? '—' : Math.round(score)}
        </span>
        <span className={`font-mono text-[10px] tracking-wider mt-1 ${tone.text} opacity-80`}>
          {isAnalyzing ? 'ANALYZING' : '/ 100'}
        </span>
      </div>
      <span className={`font-mono text-xs tracking-[0.2em] uppercase mt-4 ${tone.text}`}>
        {tone.label}
      </span>
    </div>
  );
}
