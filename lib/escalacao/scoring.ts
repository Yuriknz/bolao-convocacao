import type { Player } from '@/lib/types'

export function scoreConvocacao(picks: Player[], gabaritoIds: number[]): number {
  const gabarito = new Set(gabaritoIds)
  return picks.filter(p => gabarito.has(p.id)).length
}
