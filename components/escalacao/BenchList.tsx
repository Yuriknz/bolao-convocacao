import { Plus, X } from 'lucide-react'
import type { Player, Posicao } from '@/lib/types'

const POS_COLOR: Record<Posicao, string> = {
  GOL: 'text-yellow-400',
  DEF: 'text-blue-400',
  MEI: 'text-emerald-400',
  ATA: 'text-red-400',
}

const BENCH_SIZE = 15

interface Props {
  bench: Player[]
  onAddClick: () => void
  onRemove: (playerId: number) => void
}

export default function BenchList({ bench, onAddClick, onRemove }: Props) {
  const slots = Array.from({ length: BENCH_SIZE }, (_, i) => bench[i] ?? null)

  return (
    <div className="flex flex-col gap-1 min-w-[160px]">
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 px-1">
        Banco ({bench.length}/15)
      </p>
      {slots.map((player, i) => {
        if (!player) {
          // mostra botão de adicionar apenas no próximo slot vazio
          const isNext = i === bench.length
          return (
            <div
              key={i}
              className="h-9 rounded-lg border border-dashed border-gray-700 flex items-center px-3"
            >
              {isNext ? (
                <button
                  onClick={onAddClick}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors w-full"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              ) : (
                <span className="text-gray-700 text-xs">—</span>
              )}
            </div>
          )
        }

        return (
          <div
            key={i}
            className="h-9 rounded-lg bg-gray-800/60 border border-gray-700 flex items-center gap-2 px-3"
          >
            <span className={`text-[10px] font-bold w-7 shrink-0 ${POS_COLOR[player.posicao]}`}>
              {player.posicao}
            </span>
            <span className="text-white text-sm truncate flex-1">
              {player.nome.split(' ').slice(-1)[0]}
            </span>
            <button
              onClick={() => onRemove(player.id)}
              className="text-gray-500 hover:text-red-400 active:text-red-400 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
