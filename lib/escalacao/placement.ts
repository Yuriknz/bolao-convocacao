import type { Player } from '@/lib/types'

export const FIELD_CAPS = { GOL: 1, DEF: 4, MEI: 3, ATA: 3 } as const
export type Posicao = keyof typeof FIELD_CAPS

export function splitFieldBench(picks: Player[]) {
  const field: Record<Posicao, Player[]> = { GOL: [], DEF: [], MEI: [], ATA: [] }
  const bench: Player[] = []

  for (const p of picks) {
    if (field[p.posicao].length < FIELD_CAPS[p.posicao]) {
      field[p.posicao].push(p)
    } else {
      bench.push(p)
    }
  }

  return { field, bench }
}

export function makeSlots(players: Player[], cap: number): (Player | null)[] {
  return Array.from({ length: cap }, (_, i) => players[i] ?? null)
}
