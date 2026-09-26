import { dimensionLabels, dimensions } from '../../data/scoringRules';
import { recommendationBank } from '../../data/recommendations';
import type { AIProvider } from './AIProvider';

export class MockAIProvider implements AIProvider {
  async analyze(input: Parameters<AIProvider['analyze']>[0]) {
    const ranked = dimensions
      .map((dimension) => ({ dimension, score: input.scores[dimension] }))
      .sort((a, b) => b.score - a.score);

    const strength = ranked[0].dimension;
    const opportunity = ranked[ranked.length - 1].dimension;
    const priority = ranked.find((item) => item.score < 68)?.dimension ?? ranked[2].dimension;

    const ideas = [priority, opportunity, strength]
      .flatMap((dimension) => recommendationBank[dimension])
      .slice(0, 3);

    return {
      strength: `${dimensionLabels[strength]} aparece como el activo cultural más consistente.`,
      opportunity: `${dimensionLabels[opportunity]} es la dimensión con mayor espacio de evolución.`,
      priority: `Priorizar ${dimensionLabels[priority].toLowerCase()} puede acelerar el impacto visible.`,
      summary: `El pulso muestra una organización con energía en ${dimensionLabels[strength].toLowerCase()} y una oportunidad clara para diseñar experiencias de ${dimensionLabels[priority].toLowerCase()}.`,
      recommendedIdeas: ideas,
    };
  }
}
