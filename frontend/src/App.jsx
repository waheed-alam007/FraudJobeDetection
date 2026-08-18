import React, { useState, useEffect } from 'react'
import AnalysisHub from './components/AnalysisHub'
import EvidenceWall from './components/EvidenceWall'
import ActionCenter from './components/ActionCenter'
import { ShieldCheck } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [caseTally, setCaseTally] = useState(null);

  // Pull the real, live tally of reviewed cases from the backend —
  // no placeholder numbers, this reflects actual logged incidents.
  useEffect(() => {
    fetch(`${API_URL}/api/global-trends`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.recent_incidents === 'number') {
          setCaseTally(data.recent_incidents);
        }
      })
      .catch(() => setCaseTally(null));
  }, []);

  const handleAnalyze = async (jobInputData) => {
    setJobData(jobInputData);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: jobInputData.title,
          company: jobInputData.company,
          description: jobInputData.description,
          requirements: jobInputData.requirements || '',
          benefits: jobInputData.benefits || '',
          url: jobInputData.url || ''
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
      // Refresh the live tally after a successful review
      fetch(`${API_URL}/api/global-trends`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => data && setCaseTally(data.recent_incidents))
        .catch(() => {});
    } catch (error) {
      // No fabricated results — if the review can't be completed,
      // the person is told plainly instead of shown a fake verdict.
      setAnalysisError(
        error.name === 'TypeError'
          ? 'Could not reach the verification service. Check that the backend is running and reachable.'
          : `The review could not be completed: ${error.message}`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-void text-ink font-sans bg-grain pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Masthead */}
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-brass" strokeWidth={1.5} />
                <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-ink">
                  FraudLens
                </h1>
              </div>
              <p className="font-mono text-xs text-inkMuted tracking-widest uppercase mt-2 ml-11">
                Job Fraud Verification Bureau
              </p>
            </div>

            <div className="paper-panel rounded px-4 py-2.5 flex items-center gap-2.5 self-start sm:self-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-safe"></span>
              </span>
              <span className="font-mono text-xs text-inkMuted tracking-wide">
                {caseTally !== null
                  ? <><span className="text-ink font-medium">{caseTally.toLocaleString()}</span> {caseTally === 1 ? 'case' : 'cases'} reviewed</>
                  : 'Bureau online'}
              </span>
            </div>
          </div>
          <div className="ledger-rule mt-6"></div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <AnalysisHub onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            <EvidenceWall result={analysisResult} isAnalyzing={isAnalyzing} error={analysisError} />
            {analysisResult?.is_fraud && (
              <div className="tick-in">
                <ActionCenter result={analysisResult} jobPosting={jobData} />
              </div>
            )}
          </div>
        </main>

        <footer className="mt-16 pt-6 border-t border-panelBorder text-center">
          <p className="font-mono text-[11px] text-inkMuted/70 tracking-wide">
            Analysis is AI-generated and advisory only — always verify independently before acting on a job offer.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
