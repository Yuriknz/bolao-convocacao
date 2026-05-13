'use client'

import { useState } from 'react'
import { X, Search } from 'lucide-react'
import type { Player, Posicao } from '@/lib/types'

interface Props {
  players: Player[]
  selectedIds: number[]
  posicaoFiltro: Posicao | null
  onSelect: (player: Player) => void
  onClose: () => void
}

const POS_LABEL: Record<Posicao, string> = { GOL: 'Goleiro', DEF: 'Defensor', MEI: 'Meio-campo', ATA: 'Atacante' }
const POS_COLOR: Record<Posicao, string> = {
  GOL: 'bg-yellow-500',
  DEF: 'bg-blue-500',
  MEI: 'bg-emerald-500',
  ATA: 'bg-red-500',
}

export default function PlayerPickerModal({ players, selectedIds, posicaoFiltro, onSelect, onClose }: Props) {
  const [search, setSearch] = useState('')
  const [filtroPos, setFiltroPos] = useState<Posicao | 'TODOS'>(posicaoFiltro ?? 'TODOS')

  const selectedSet = new Set(selectedIds)

  const filtered = players.filter(p => {
    const matchPos = filtroPos === 'TODOS' || p.posicao === filtroPos
    const q = search.toLowerCase()
    const matchSearch = !q || p.nome.toLowerCase().includes(q) || p.clube.toLowerCase().includes(q)
    return matchPos && matchSearch
  })

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-[#111c2b] rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
          <h2 className="text-white font-semibold">
            {posicaoFiltro ? POS_LABEL[posicaoFiltro] : 'Selecionar jogador'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Busca */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome ou clube..."
              className="w-full bg-[#1a2535] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        {/* Filtro posição */}
        {!posicaoFiltro && (
          <div className="flex gap-2 px-4 pb-2 overflow-x-auto">
            {(['TODOS', 'GOL', 'DEF', 'MEI', 'ATA'] as const).map(pos => (
              <button
                key={pos}
                onClick={() => setFiltroPos(pos)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors
                  ${filtroPos === pos
                    ? pos === 'TODOS' ? 'bg-gray-200 text-black' : `${POS_COLOR[pos as Posicao]} text-white`
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                  }`}
              >
                {pos}
              </button>
            ))}
          </div>
        )}

        {/* Lista */}
        <div className="overflow-y-auto flex-1 px-4 pb-4">
          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">Nenhum jogador encontrado</p>
          )}
          {filtered.map(player => {
            const isSelected = selectedSet.has(player.id)
            return (
              <button
                key={player.id}
                disabled={isSelected}
                onClick={() => onSelect(player)}
                className={`w-full flex items-center gap-3 py-2.5 border-b border-gray-700/40 text-left transition-opacity
                  ${isSelected ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5'}`}
              >
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${POS_COLOR[player.posicao]} text-white`}>
                  {player.posicao}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{player.nome}</p>
                  <p className="text-gray-400 text-xs truncate">{player.clube}</p>
                </div>
                {isSelected && <span className="text-gray-500 text-xs shrink-0">Escolhido</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
