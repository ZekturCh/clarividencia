import type { Question } from '../types';

export const questions: Question[] = [
  {
    id: 'mainChallenge',
    title: '¿Cuál es hoy tu principal reto de personas?',
    options: [
      { id: 'engagement', label: 'Engagement', category: 'Engagement', weights: { engagement: 28, conexion: 10, bienestar: 4 } },
      { id: 'integration', label: 'Integración de equipos', category: 'Integración', weights: { conexion: 24, colaboracion: 18, pertenencia: 8 } },
      { id: 'culture', label: 'Cultura y valores', category: 'Cultura', weights: { cultura: 26, pertenencia: 14, comunicacion: 6 } },
      { id: 'recognition', label: 'Reconocimiento', category: 'Reconocimiento', weights: { reconocimiento: 30, engagement: 8 } },
      { id: 'communication', label: 'Comunicación interna', category: 'Comunicación interna', weights: { comunicacion: 30, conexion: 8 } },
      { id: 'wellbeing', label: 'Bienestar', category: 'Bienestar', weights: { bienestar: 30, engagement: 6 } },
      { id: 'milestones', label: 'Celebraciones / hitos', category: 'Otros', weights: { reconocimiento: 16, pertenencia: 12, cultura: 6 } },
    ],
  },
  {
    id: 'teamState',
    title: '¿Cómo describirías hoy a tu equipo?',
    options: [
      { id: 'connected', label: 'Súper conectado', weights: { conexion: 24, colaboracion: 18, pertenencia: 14, engagement: 10 } },
      { id: 'good', label: 'Funciona bien, pero puede mejorar', weights: { cultura: 12, comunicacion: 10, engagement: 8, bienestar: 6 } },
      { id: 'disconnected', label: 'Algo desconectado', weights: { conexion: -8, comunicacion: 18, pertenencia: 12, colaboracion: 10 } },
      { id: 'change', label: 'Estamos viviendo muchos cambios', weights: { cultura: 12, comunicacion: 16, bienestar: 10, innovacion: 12 } },
    ],
  },
  {
    id: 'desiredOutcome',
    title: '¿Qué te gustaría generar más en tu organización este año?',
    options: [
      { id: 'belonging', label: 'Pertenencia', category: 'Pertenencia', weights: { pertenencia: 28, cultura: 10 } },
      { id: 'motivation', label: 'Motivación', category: 'Motivación', weights: { engagement: 24, reconocimiento: 10 } },
      { id: 'collaboration', label: 'Colaboración', category: 'Colaboración', weights: { colaboracion: 26, conexion: 10 } },
      { id: 'innovation', label: 'Innovación', category: 'Innovación', weights: { innovacion: 30, cultura: 6 } },
      { id: 'recognition', label: 'Reconocimiento', category: 'Reconocimiento', weights: { reconocimiento: 26, engagement: 8 } },
      { id: 'wellbeing', label: 'Bienestar', category: 'Bienestar', weights: { bienestar: 26, conexion: 6 } },
    ],
  },
  {
    id: 'orgSize',
    title: '¿Cuántas personas tiene tu organización?',
    options: [
      { id: 'under-100', label: '<100', weights: { conexion: 8, cultura: 8, innovacion: 6 } },
      { id: '100-500', label: '100-500', weights: { comunicacion: 8, colaboracion: 8, reconocimiento: 6 } },
      { id: '500-1000', label: '500-1000', weights: { comunicacion: 12, cultura: 8, bienestar: 6 } },
      { id: 'over-1000', label: '+1000', weights: { comunicacion: 16, pertenencia: 10, reconocimiento: 8 } },
    ],
  },
  {
    id: 'experienceFocus',
    title: 'Si pudieras mejorar UNA experiencia de tus colaboradores este año, ¿cuál sería?',
    options: [
      { id: 'onboarding', label: 'Onboarding', weights: { cultura: 16, pertenencia: 14, comunicacion: 8 } },
      { id: 'integration', label: 'Integración', weights: { conexion: 18, colaboracion: 14 } },
      { id: 'conventions', label: 'Convenciones', weights: { cultura: 12, pertenencia: 12, engagement: 8 } },
      { id: 'recognition', label: 'Reconocimiento', weights: { reconocimiento: 26, engagement: 8 } },
      { id: 'celebrations', label: 'Celebraciones', weights: { reconocimiento: 14, pertenencia: 12, bienestar: 6 } },
      { id: 'team-building', label: 'Team building', weights: { conexion: 16, colaboracion: 16, bienestar: 6 } },
      { id: 'values', label: 'Cultura y valores', weights: { cultura: 24, pertenencia: 10 } },
    ],
  },
];
