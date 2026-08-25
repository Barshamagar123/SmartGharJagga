// src/pages/FindMyMatch/FindMyMatch.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatching } from '../../hooks/useMatching';
import { useAuth } from '../../hooks/useAuth';
import {
  StepTracker,
  BudgetStep,
  LocationStep,
  SizeTypeStep,
  MustHavesStep,
  MatchResults,
} from '../../components/Matching';

const steps = ['01 Budget', '02 Where', '03 Size & type', '04 Must-haves'];

type Answers = {
  budget: string;
  budgetMin: number;
  budgetMax: number;
  location: string[];
  type: string[];
  size: string;
  road: string;
  parking: boolean;
};

const FindMyMatch: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    preferences,
    matches,
    matchCount,
    loading,
    saving,
    error,
    savePreferences,
    loadMatches,
    learnFromBehavior,
  } = useMatching();

  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [hasLoadedMatches, setHasLoadedMatches] = useState(false);
  const [answers, setAnswers] = useState<Answers>({
    budget: '',
    budgetMin: 0,
    budgetMax: 0,
    location: [],
    type: [],
    size: '',
    road: '',
    parking: false,
  });

  // ✅ Load existing preferences but DON'T auto-load matches
  useEffect(() => {
    if (preferences) {
      setAnswers(prev => ({
        ...prev,
        budgetMin: preferences.budgetMin || 0,
        budgetMax: preferences.budgetMax || 0,
        location: preferences.location ? [preferences.location] : [],
        type: [preferences.propertyType?.toLowerCase() || ''],
        parking: preferences.parkingNeeded || false,
      }));
      
      // ✅ Only show results if user has saved preferences AND we've loaded matches
      // But we won't auto-load matches - user must click "See my matches"
      if (preferences.budgetMin > 0 && preferences.budgetMax > 0) {
        // Don't set showResults to true automatically
        // The user must click the button to see results
      }
    }
  }, [preferences]);

  // ✅ Reset showResults when user changes steps
  useEffect(() => {
    if (step < 3) {
      // If user goes back to edit, hide results
      setShowResults(false);
      setHasLoadedMatches(false);
    }
  }, [step]);

  const handleSavePreferences = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // ✅ Validate all required fields
    if (!answers.budgetMin || !answers.budgetMax) {
      alert('Please select a budget range');
      return;
    }

    if (answers.location.length === 0) {
      alert('Please select at least one location');
      return;
    }

    if (answers.type.length === 0) {
      alert('Please select at least one property type');
      return;
    }

    const success = await savePreferences({
      budgetMin: answers.budgetMin,
      budgetMax: answers.budgetMax,
      location: answers.location[0] || 'Kathmandu',
      propertyType: (answers.type[0]?.toUpperCase() || 'HOUSE') as any,
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
      purpose: 'SALE' as any,
      parkingNeeded: answers.parking,
    });

    if (success) {
      // ✅ Load matches and show results
      await loadMatches();
      setHasLoadedMatches(true);
      setShowResults(true);
    }
  };

  const isStepComplete = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        return answers.budget !== '' && answers.budgetMin > 0 && answers.budgetMax > 0;
      case 1:
        return answers.location.length > 0;
      case 2:
        return answers.type.length > 0;
      case 3:
        return true; // Must-haves are optional
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (!isStepComplete(step)) {
      return;
    }
    
    if (step === 3) {
      handleSavePreferences();
    } else {
      setStep(s => s + 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <BudgetStep
            value={answers.budget}
            onChange={(value) => {
              setAnswers(prev => ({ ...prev, budget: value }));
              const budgetMap: Record<string, { min: number; max: number }> = {
                'Under Rs 50 Lakh': { min: 0, max: 5000000 },
                'Rs 50L – 1 Crore': { min: 5000000, max: 10000000 },
                'Rs 1Cr – 3Cr': { min: 10000000, max: 30000000 },
                'Rs 3Cr – 7Cr': { min: 30000000, max: 70000000 },
                'Rs 7Cr+': { min: 70000000, max: 1000000000 },
              };
              const budget = budgetMap[value];
              if (budget) {
                setAnswers(prev => ({
                  ...prev,
                  budgetMin: budget.min,
                  budgetMax: budget.max,
                }));
              }
            }}
          />
        );
      case 1:
        return (
          <LocationStep
            selected={answers.location}
            onToggle={(value) => {
              setAnswers(prev => ({
                ...prev,
                location: prev.location.includes(value)
                  ? prev.location.filter(x => x !== value)
                  : [...prev.location, value],
              }));
            }}
          />
        );
      case 2:
        return (
          <SizeTypeStep
            selectedTypes={answers.type}
            onTypeToggle={(value) => {
              setAnswers(prev => ({
                ...prev,
                type: prev.type.includes(value)
                  ? prev.type.filter(x => x !== value)
                  : [...prev.type, value],
              }));
            }}
            selectedSize={answers.size}
            onSizeChange={(value) => {
              setAnswers(prev => ({ ...prev, size: value }));
            }}
          />
        );
      case 3:
        return (
          <MustHavesStep
            roadWidth={answers.road}
            onRoadWidthChange={(value) => {
              setAnswers(prev => ({ ...prev, road: value }));
            }}
            parking={answers.parking}
            onParkingChange={(value) => {
              setAnswers(prev => ({ ...prev, parking: value }));
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Khand', color: '#14181D' }}>
          Find My Match
        </h1>
        <p className="text-sm mt-1" style={{ color: '#5C6570' }}>
          {showResults 
            ? '🎯 Here are your AI-powered property matches' 
            : 'Answer all questions to get AI-powered property recommendations'}
        </p>
      </div>

      <StepTracker
        steps={steps}
        currentStep={step}
        onStepClick={(index) => index <= step && setStep(index)}
      />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: questions */}
        <div>
          <div className="mb-6">{renderStep()}</div>

          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-5 py-2.5 rounded border text-sm font-medium"
                style={{ borderColor: '#D3CFC5', color: '#333A44', fontFamily: 'Mukta' }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded text-sm font-semibold transition-colors hover:bg-[#23461E]"
              style={{
                background: '#2D5A27',
                color: '#FFFFFF',
                fontFamily: 'Mukta',
                opacity: isStepComplete(step) ? 1 : 0.5,
                cursor: isStepComplete(step) ? 'pointer' : 'not-allowed',
              }}
              disabled={!isStepComplete(step) || saving}
            >
              {saving ? 'Saving...' : step < 3 ? 'Continue →' : 'See my matches'}
            </button>
          </div>

          {!isStepComplete(step) && step < 3 && (
            <div className="mt-2 text-sm" style={{ color: '#B07C1E' }}>
              ⚠️ {step === 0 ? 'Please select a budget range' :
                  step === 1 ? 'Please select at least one location' :
                  step === 2 ? 'Please select at least one property type' : ''}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right: live results - ✅ ONLY show after user clicks "See my matches" */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-sm font-mono" style={{ color: '#5C6570' }}>
              {showResults ? '🎯 MATCH RESULTS' : '📝 COMPLETE ALL STEPS'}
            </span>
            {showResults && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600">
                {matchCount} matches
              </span>
            )}
          </div>
          <div className="font-bold mb-4" style={{ fontFamily: 'Khand', fontSize: 32, color: '#14181D' }}>
            {showResults 
              ? loading 
                ? 'Loading matches...' 
                : `${matchCount} properties match your preferences`
              : '🔮 AI Matching'}
          </div>

          <MatchResults
            matches={matches}
            matchCount={matchCount}
            loading={loading}
            showResults={showResults}
            onLearn={learnFromBehavior}
          />
        </div>
      </div>
    </div>
  );
};

export default FindMyMatch;