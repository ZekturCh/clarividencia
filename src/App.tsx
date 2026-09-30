import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AmbientLines } from './components/AmbientLines';
import { DevTools } from './components/DevTools';
import { WaveTransition } from './components/WaveTransition';
import {
  ANALYSIS_MAX_DURATION,
  ANALYSIS_MIN_DURATION,
  ENABLE_DASHBOARD,
  ENABLE_LEAD_FORM,
  FINAL_IDLE_TIMEOUT,
  QUESTION_DIAGNOSTIC_MAX_DURATION,
  QUESTION_DIAGNOSTIC_MIN_DURATION,
} from './config';
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
import { getVariableDelay } from './utils/timing';

type FlowStep = 'start' | 'questions' | 'analysis' | 'result' | 'lead' | 'final';

const transitionMessages = [
  'Leyendo opciones seleccionadas',
  'Analizando propuesta cultural',
  'Conectando señales de equipo',
  'ClarividencIA está actuando para ti',
];

function App() {
  const isDashboard = window.location.pathname.endsWith('/dashboard') && ENABLE_DASHBOARD;
  const { aiProvider, storageProvider } = useAppServices();
  const [step, setStep] = useState<FlowStep>('start');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [activeSession, setActiveSession] = useState<SessionRecord | null>(null);
  const [transition, setTransition] = useState({
    active: false,
    durationMs: QUESTION_DIAGNOSTIC_MIN_DURATION,
    message: transitionMessages[0],
    runId: 0,
  });
  const [isQuestionAdvancing, setIsQuestionAdvancing] = useState(false);
  const questionTimers = useRef<number[]>([]);

  const scores = useMemo(() => calculateScores(answers), [answers]);
  const totalScore = useMemo(() => calculateTotalScore(scores), [scores]);

  const clearQuestionTimers = useCallback(() => {
    questionTimers.current.forEach((timer) => window.clearTimeout(timer));
    questionTimers.current = [];
  }, []);

  const scheduleQuestionTimer = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      questionTimers.current = questionTimers.current.filter((currentTimer) => currentTimer !== timer);
      callback();
    }, delay);

    questionTimers.current.push(timer);
  }, []);

  const restart = useCallback(() => {
    clearQuestionTimers();
    setStep('start');
    setQuestionIndex(0);
    setAnswers({});
    setInsight(null);
    setActiveSession(null);
    setIsQuestionAdvancing(false);
    setTransition({
      active: false,
      durationMs: QUESTION_DIAGNOSTIC_MIN_DURATION,
      message: transitionMessages[0],
      runId: 0,
    });
  }, [clearQuestionTimers]);

  useIdleReset(restart);

  useEffect(() => clearQuestionTimers, [clearQuestionTimers]);

  useEffect(() => {
    if (step !== 'analysis') return;

    const thinkingDelay = getVariableDelay(ANALYSIS_MIN_DURATION, ANALYSIS_MAX_DURATION);
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
    }, thinkingDelay);

    return () => window.clearTimeout(timer);
  }, [aiProvider, answers, scores, step, storageProvider, totalScore]);

  useEffect(() => {
    if (step !== 'final') return;
    const timer = window.setTimeout(restart, FINAL_IDLE_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, [restart, step]);

  const answerQuestion = (questionId: keyof Answers, optionId: string) => {
    if (transition.active || isQuestionAdvancing) return;

    const nextMessage = transitionMessages[questionIndex % transitionMessages.length];
    const diagnosticDuration = getVariableDelay(QUESTION_DIAGNOSTIC_MIN_DURATION, QUESTION_DIAGNOSTIC_MAX_DURATION);
    const swapAt = Math.round(diagnosticDuration * 0.52);
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
    setIsQuestionAdvancing(true);
    setTransition((current) => ({
      active: true,
      durationMs: diagnosticDuration,
      message: nextMessage,
      runId: current.runId + 1,
    }));

    scheduleQuestionTimer(() => {
      if (questionIndex === questions.length - 1) {
        setStep('analysis');
        return;
      }
      setQuestionIndex((current) => current + 1);
    }, swapAt);

    scheduleQuestionTimer(() => {
      setTransition((current) => ({ ...current, active: false }));
      setIsQuestionAdvancing(false);
    }, diagnosticDuration);
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
      {step === 'questions' && (
        <QuestionScreen key={`question-${questionIndex}`} index={questionIndex} answers={answers} onAnswer={answerQuestion} />
      )}
      {step === 'analysis' && <AnalysisScreen answers={answers} scores={scores} />}
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
      <WaveTransition
        key={`transition-${transition.runId}`}
        active={transition.active}
        durationMs={transition.durationMs}
        message={transition.message}
      />
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
