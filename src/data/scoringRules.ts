import type { Dimension } from '../types';

export const dimensions: Dimension[] = [
  'cultura',
  'conexion',
  'engagement',
  'comunicacion',
  'reconocimiento',
  'bienestar',
  'colaboracion',
  'pertenencia',
  'innovacion',
];

export const dimensionLabels: Record<Dimension, string> = {
  cultura: 'Cultura',
  conexion: 'Conexión',
  engagement: 'Engagement',
  comunicacion: 'Comunicación',
  reconocimiento: 'Reconocimiento',
  bienestar: 'Bienestar',
  colaboracion: 'Colaboración',
  pertenencia: 'Pertenencia',
  innovacion: 'Innovación',
};

export const radarDimensions: Dimension[] = ['cultura', 'conexion', 'engagement', 'comunicacion', 'bienestar'];

export const baseScore = 48;
export const minRawScore = 0;
export const maxRawScore = 100;
