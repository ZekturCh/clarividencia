import { useCallback, useEffect, useMemo, useState } from 'react';
import { AmbientLines } from './components/AmbientLines';
import { DevTools } from './components/DevTools';
import { FINAL_IDLE_TIMEOUT, ANALYSIS_DURATION, ENABLE_DASHBOARD, ENABLE_LEAD_FORM } from './config';
import { useAppServices } from './context/AppServicesContext';
import { questions } from './data/questions';
import { useIdleReset } from './hooks/useIdleReset';
import { calculateScores, calculateTotalScore } from './services/scoringEngine';
import { AnalysisScreen } from './screens/AnalysisScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { FinalScreen } from './screens/FinalScreen';
import { LeadScreen, type LeadFormValues } from './screens/LeadScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { ResultScreen } from './screens/ResultScreen';
import { StartScreen } from './screens/StartScreen';
import type { AIInsight, Answers, SessionRecord } from './types';
import { createId } from './utils/ids';

type FlowStep = 'start' | 'questions' | 'analysis' | 'result' | 'lead' | 'final';

function App() {
  const isDashboard = window.location.pathname === '/dashboard' && ENABLE_DASHBOARD;
  const { aiProvider, storageProvider } = useAppServices();
  const [step, setStep] = useState<FlowStep>('start');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [activeSession, setActiveSession] = useState<SessionRecord | null>(null);

  const scores = useMemo(() => calculateScores(answers), [answers]);
  const totalScore = useMemo(() => calculateTotalScore(scores), [scores]);

  const restart = useCallback(() => {
    setStep('start');
    setQuestionIndex(0);
    setAnswers({});
    setInsight(null);
    setActiveSession(null);
  }, []);

  useIdleReset(restart);

  useEffect(() => {
    if (step !== 'analysis') return;

    const timer = window.setTimeout(async () => {
      const analysis = await aiProvider.analyze({ scores, answers });
      const session: SessionRecord = {
        id: createId('session'),
        createdAt: new Date().toISOString(),
        answers,
        scores,
        totalScore,
        insight: analysis,
      };

      storageProvider.saveSession(session);
      setInsight(analysis);
      setActiveSession(session);
      setStep('result');
    }, ANALYSIS_DURATION);

    return () => window.clearTimeout(timer);
  }, [aiProvider, answers, scores, step, storageProvider, totalScore]);

  useEffect(() => {
    if (step !== 'final') return;
    const timer = window.setTimeout(restart, FINAL_IDLE_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, [restart, step]);

  const answerQuestion = (questionId: keyof Answers, optionId: string) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
    if (questionIndex === questions.length - 1) {
      setStep('analysis');
      return;
    }
    setQuestionIndex((current) => current + 1);
  };

  const submitLead = (values: LeadFormValues) => {
    if (!activeSession) return;
    storageProvider.saveLead({
      id: createId('lead'),
      sessionId: activeSession.id,
      createdAt: new Date().toISOString(),
      ...values,
    });
    setStep('final');
  };

  if (isDashboard) {
    return (
      <AppShell>
        <DashboardScreen />
      </AppShell>
    );
  }

  return (
    <AppShell>
      {step === 'start' && <StartScreen onStart={() => setStep('questions')} />}
      {step === 'questions' && <QuestionScreen index={questionIndex} answers={answers} onAnswer={answerQuestion} />}
      {step === 'analysis' && <AnalysisScreen scores={scores} />}
      {step === 'result' && insight && (
        <ResultScreen
          scores={scores}
          totalScore={totalScore}
          insight={insight}
          onLead={() => (ENABLE_LEAD_FORM ? setStep('lead') : setStep('final'))}
        />
      )}
      {step === 'lead' && <LeadScreen onSubmit={submitLead} />}
      {step === 'final' && <FinalScreen stats={storageProvider.getAggregateStats()} onRestart={restart} />}
      <DevTools />
    </AppShell>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-shell">
      <AmbientLines />
      {children}
    </main>
  );
}

export default App;
