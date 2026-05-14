import { Plus } from 'lucide-react'
import type { Player, Posicao } from '@/lib/types'
import { FIELD_CAPS, makeSlots } from '@/lib/escalacao/placement'

const POS_COLOR: Record<Posicao, string> = {
  GOL: 'bg-yellow-500',
  DEF: 'bg-blue-500',
  MEI: 'bg-emerald-400',
  ATA: 'bg-red-500',
}

interface SlotProps {
  player: Player | null
  posicao: Posicao
  onClickEmpty: () => void
  onClickFilled: (player: Player) => void
}

function Slot({ player, posicao, onClickEmpty, onClickFilled }: SlotProps) {
  if (!player) {
    return (
      <button
        onClick={onClickEmpty}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-11 h-14 rounded-lg border-2 border-dashed border-white/30 flex flex-col items-center justify-center hover:border-white/60 transition-colors">
          <Plus className="w-4 h-4 text-white/50 group-hover:text-white/80" />
        </div>
        <span className="text-[10px] text-white/40">{posicao}</span>
      </button>
    )
  }

  return (
    <button
      onClick={() => onClickFilled(player)}
      className="flex flex-col items-center gap-1 group"
      title="Clique para remover"
    >
      <div className="w-11 h-14 rounded-lg bg-gray-900/80 border border-gray-600 hover:border-red-500/70 transition-colors flex flex-col items-center justify-center px-1">
        <span className="text-white text-[11px] font-bold leading-tight text-center line-clamp-2">
          {player.nome.split(' ').slice(-1)[0]}
        </span>
        <span className={`text-[9px] px-1 rounded mt-1 ${POS_COLOR[posicao]} text-white font-semibold`}>
          {posicao}
        </span>
      </div>
      <span className="text-[9px] text-white/40 max-w-[44px] truncate">
        {player.clube.substring(0, 4).toUpperCase()}
      </span>
    </button>
  )
}

interface Props {
  field: Record<Posicao, Player[]>
  onOpenModal: (posicao: Posicao) => void
  onRemove: (playerId: number) => void
}

export default function FieldView({ field, onOpenModal, onRemove }: Props) {
  const rows: { posicao: Posicao; gap: string }[] = [
    { posicao: 'ATA', gap: 'gap-3' },
    { posicao: 'MEI', gap: 'gap-3' },
    { posicao: 'DEF', gap: 'gap-2' },
    { posicao: 'GOL', gap: 'gap-3' },
  ]

  return (
    <div
      className="relative flex flex-col justify-around items-center rounded-2xl overflow-hidden py-4 w-full md:w-auto"
      style={{
        background: 'linear-gradient(to bottom, #15803d 0%, #166534 50%, #14532d 100%)',
        minHeight: 420,
      }}
    >
      {/* Field lines */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Center line */}
        <div className="absolute left-6 right-6 top-1/2 h-px bg-white/15" />
        {/* Center circle */}
        <div className="absolute left-1/2 top-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 border border-white/15 rounded-full" />
        {/* Top penalty area */}
        <div className="absolute left-1/2 top-4 w-24 h-10 -translate-x-1/2 border border-white/15" />
        {/* Bottom penalty area */}
        <div className="absolute left-1/2 bottom-4 w-24 h-10 -translate-x-1/2 border border-white/15" />
      </div>

      {rows.map(({ posicao, gap }) => {
        const slots = makeSlots(field[posicao], FIELD_CAPS[posicao])
        return (
          <div key={posicao} className={`relative flex ${gap} justify-center`}>
            {slots.map((player, i) => (
              <Slot
                key={i}
                player={player}
                posicao={posicao}
                onClickEmpty={() => onOpenModal(posicao)}
                onClickFilled={p => onRemove(p.id)}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
