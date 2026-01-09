'use client';

import { useState, useRef, useEffect } from 'react';
import Hero from '../src/components/Hero';
import Wizard from '../src/components/Wizard';
import Results from '../src/components/Results';
import { calculateCountryScores } from '../src/lib/scoring';
import { WizardState, ScoringResult } from '../src/types/wizard';

export default function Home() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardAnswers, setWizardAnswers] = useState<WizardState | null>(null);
  const [scoringResults, setScoringResults] = useState<ScoringResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleWizardComplete = (answers: WizardState) => {
    setWizardAnswers(answers);
    
    // Calculate scores using the scoring engine
    const results = calculateCountryScores(answers);
    setScoringResults(results);
  };

  // Scroll to results after wizard completes
  useEffect(() => {
    if (scoringResults && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [scoringResults]);

  const handleReset = () => {
    setWizardAnswers(null);
    setScoringResults(null);
  };

  // Confidence badge styling
  const getConfidenceBadge = (confidence: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-orange-100 text-orange-800',
    };
    return styles[confidence];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero onStartMatchmaker={() => setIsWizardOpen(true)} />
      
      {/* Wizard Modal */}
      <Wizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleWizardComplete}
      />
      
      <main className="container mx-auto px-4 py-12" ref={resultsRef}>
        {scoringResults && wizardAnswers ? (
          <Results
            wizardAnswers={wizardAnswers}
            scoringResults={scoringResults}
            onReset={handleReset}
          />
        ) : (
          /* DEFAULT VIEW - Before wizard completion */
          <div className="text-center">
            <h1 className="text-5xl font-bold text-brand-teal mb-4">
              Welcome to the HopeChest Vision Trip Fit Guide
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover which HopeChest partnership is the perfect fit for your church's DNA.
            </p>
            <p className="text-gray-500 mb-8">
              Click "Start Matchmaker" above to begin your personalized assessment.
            </p>
            
            {/* Optional: Show all countries as preview */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                HopeChest Partners With Churches In:
              </h2>
              <div className="flex justify-center gap-8 text-xl text-gray-700">
                <div className="text-center">
                  <div className="text-4xl mb-2">🇬🇹</div>
                  <p className="font-semibold">Guatemala</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🇺🇬</div>
                  <p className="font-semibold">Uganda</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🇪🇹</div>
                  <p className="font-semibold">Ethiopia</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
