import React, { useState } from 'react';
import { FileSearch, Loader2 } from 'lucide-react';

const FIELDS = [
  { name: 'title', label: 'Job Title', exhibit: 'A', placeholder: 'e.g. Data Entry Assistant', required: true },
  { name: 'company', label: 'Company Claimed', exhibit: 'B', placeholder: 'e.g. Globex Corp', required: true },
];

export default function AnalysisHub({ onAnalyze, isAnalyzing }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    benefits: '',
    url: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  return (
    <div className="paper-panel rounded-lg p-7 sm:p-8 relative overflow-hidden">
      {isAnalyzing && (
        <div className="absolute inset-0 bg-void/90 z-20 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-full h-[2px] bg-brass/80 absolute top-0 scanning-sweep shadow-[0_0_12px_rgba(200,155,74,0.6)]" />
          <Loader2 className="w-10 h-10 text-brass animate-spin mb-4" strokeWidth={1.5} />
          <span className="font-mono text-xs text-brass tracking-widest uppercase">Reviewing case file…</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-7 pb-4 border-b border-panelBorder">
        <div className="flex items-center gap-2.5">
          <FileSearch className="text-brass w-5 h-5" strokeWidth={1.75} />
          <h2 className="font-display text-xl font-medium text-ink">Case Intake</h2>
        </div>
        <span className="font-mono text-[11px] text-inkMuted uppercase tracking-wider">New Submission</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FIELDS.map((field) => (
            <div key={field.name}>
              <label className="flex items-baseline gap-2 text-xs text-inkMuted mb-2 font-mono tracking-wide uppercase">
                <span className="text-brass">Exhibit {field.exhibit}</span>
                <span>{field.label}</span>
              </label>
              <input
                name={field.name}
                onChange={handleChange}
                required={field.required}
                className="w-full bg-void/60 border border-panelBorder rounded px-3.5 py-2.5 text-ink text-sm focus:border-brass focus:ring-1 focus:ring-brass/40 focus:outline-none transition-colors placeholder-inkMuted/50"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="flex items-baseline gap-2 text-xs text-inkMuted mb-2 font-mono tracking-wide uppercase">
            <span className="text-brass">Exhibit C</span>
            <span>Source URL (optional)</span>
          </label>
          <input
            name="url"
            onChange={handleChange}
            type="url"
            className="w-full bg-void/60 border border-panelBorder rounded px-3.5 py-2.5 text-ink text-sm focus:border-brass focus:ring-1 focus:ring-brass/40 focus:outline-none transition-colors placeholder-inkMuted/50"
            placeholder="https://linkedin.com/jobs/..."
          />
        </div>

        <div>
          <label className="flex items-baseline gap-2 text-xs text-inkMuted mb-2 font-mono tracking-wide uppercase">
            <span className="text-brass">Exhibit D</span>
            <span>Full Description</span>
          </label>
          <textarea
            name="description"
            onChange={handleChange}
            required
            rows={6}
            className="w-full bg-void/60 border border-panelBorder rounded px-3.5 py-2.5 text-ink text-sm focus:border-brass focus:ring-1 focus:ring-brass/40 focus:outline-none transition-colors resize-none placeholder-inkMuted/50 leading-relaxed"
            placeholder="Paste the job posting text here, in full…"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="flex items-baseline gap-2 text-xs text-inkMuted mb-2 font-mono tracking-wide uppercase">
              <span className="text-brass">Exhibit E</span>
              <span>Requirements (optional)</span>
            </label>
            <textarea
              name="requirements"
              onChange={handleChange}
              rows={2}
              className="w-full bg-void/60 border border-panelBorder rounded px-3.5 py-2.5 text-ink text-sm focus:border-brass focus:ring-1 focus:ring-brass/40 focus:outline-none transition-colors resize-none placeholder-inkMuted/50"
              placeholder="Stated requirements…"
            />
          </div>
          <div>
            <label className="flex items-baseline gap-2 text-xs text-inkMuted mb-2 font-mono tracking-wide uppercase">
              <span className="text-brass">Exhibit F</span>
              <span>Benefits (optional)</span>
            </label>
            <textarea
              name="benefits"
              onChange={handleChange}
              rows={2}
              className="w-full bg-void/60 border border-panelBorder rounded px-3.5 py-2.5 text-ink text-sm focus:border-brass focus:ring-1 focus:ring-brass/40 focus:outline-none transition-colors resize-none placeholder-inkMuted/50"
              placeholder="Stated benefits…"
            />
          </div>
        </div>

        <button
          disabled={isAnalyzing}
          className="w-full bg-brass hover:bg-brass/90 text-void font-semibold py-3.5 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 tracking-wide"
        >
          {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
          {isAnalyzing ? 'Reviewing…' : 'Submit for Review'}
        </button>
      </form>
    </div>
  );
}
