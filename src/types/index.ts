export type Dimension =
  | 'cultura'
  | 'conexion'
  | 'engagement'
  | 'comunicacion'
  | 'reconocimiento'
  | 'bienestar'
  | 'colaboracion'
  | 'pertenencia'
  | 'innovacion';

export type QuestionId = 'mainChallenge' | 'teamState' | 'desiredOutcome' | 'orgSize' | 'experienceFocus';

export interface AnswerOption {
  id: string;
  label: string;
  weights: Partial<Record<Dimension, number>>;
  category?: string;
}

export interface Question {
  id: QuestionId;
  title: string;
  options: AnswerOption[];
}

export type Answers = Partial<Record<QuestionId, string>>;

export type Scores = Record<Dimension, number>;

export interface AIInsight {
  strength: string;
  opportunity: string;
  priority: string;
  summary: string;
  recommendedIdeas: string[];
}

export interface SessionRecord {
  id: string;
  createdAt: string;
  answers: Answers;
  scores: Scores;
  totalScore: number;
  insight: AIInsight;
}

export interface LeadRecord {
  id: string;
  sessionId: string;
  createdAt: string;
  fullName: string;
  company: string;
  role: string;
  email: string;
  whatsapp: string;
  interests: string[];
  accepted: boolean;
}

export interface AggregateStats {
  totalParticipants: number;
  averageScore: number;
  averageScores: Scores;
  challengeDistribution: Array<{ label: string; count: number; percentage: number }>;
  desiredOutcomeTop: Array<{ label: string; count: number; percentage: number }>;
}
