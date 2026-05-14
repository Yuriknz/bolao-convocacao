'use client'

import { useState } from 'react'
import { Link2, Trash2, Trophy } from 'lucide-react'
import Link from 'next/link'
import type { Player, Posicao } from '@/lib/types'
import { splitFieldBench } from '@/lib/escalacao/placement'
import FieldView from './FieldView'
import BenchList from './BenchList'
import PlayerPickerModal from './PlayerPickerModal'
import ExportButton from './ExportButton'

interface Props {
  allPlayers: Player[]
  initialPicks: Player[]
  bolaoId: string
  bolaoNome: string
  inviteCode: string
  isAdmin: boolean
}

export default function EscalacaoClient({
  allPlayers,
  initialPicks,
  bolaoId,
  bolaoNome,
  inviteCode,
  isAdmin,
}: Props) {
  const [picks, setPicks] = useState<Player[]>(initialPicks)
  const [modal, setModal] = useState<{ posicao: Posicao | null } | null>(null)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  const { field, bench } = splitFieldBench(picks)
  const isComplete = picks.length === 26

  function openModal(posicao: Posicao | null) {
    setModal({ posicao })
  }

  function handleSelect(player: Player) {
    if (picks.length >= 26 || picks.find(p => p.id === player.id)) return
    setPicks(prev => [...prev, player])
    setModal(null)
  }

  function handleRemove(playerId: number) {
    setPicks(prev => prev.filter(p => p.id !== playerId))
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/join/${inviteCode}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSalvar() {
    if (!isComplete) return
    setSaving(true)
    setSavedMsg('')

    const res = await fetch(`/api/convocacao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bolaoId, playerIds: picks.map(p => p.id) }),
    })

    if (res.ok) {
      setSavedMsg('Convocação salva!')
    } else {
      const data = await res.json()
      setSavedMsg(data.erro ?? 'Erro ao salvar')
    }
    setSaving(false)
    setTimeout(() => setSavedMsg(''), 3000)
  }

  return (
    <div className="min-h-screen bg-[#0d1520] text-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-800">
        <div className="min-w-0">
          <h1 className="font-bold text-white truncate">{bolaoNome}</h1>
          <p className="text-xs text-gray-500">Convocação de 26 jogadores</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Contador */}
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${isComplete ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-300'}`}>
            {picks.length}/26
          </span>
          {/* Ranking */}
          <Link
            href={`/bolao/${bolaoId}/ranking`}
            className="flex items-center gap-1 text-xs bg-gray-700 hover:bg-gray-600 active:bg-gray-600 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ranking</span>
          </Link>
          {/* Copiar link */}
          {isAdmin && (
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 text-xs bg-gray-700 hover:bg-gray-600 active:bg-gray-600 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Convite'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Zona de captura para o PNG */}
      <div id="escalacao-capture" className="flex flex-col md:flex-row gap-4 p-4 justify-center bg-[#0d1520]">
        <FieldView field={field} onOpenModal={openModal} onRemove={handleRemove} />
        <BenchList bench={bench} onAddClick={() => openModal(null)} onRemove={handleRemove} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 px-4 pb-6">
        <button
          onClick={() => setPicks([])}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Limpar
        </button>

        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className={`text-sm ${savedMsg.includes('Erro') ? 'text-red-400' : 'text-green-400'}`}>
              {savedMsg}
            </span>
          )}
          <ExportButton
            targetId="escalacao-capture"
            filename={`convocacao-${bolaoNome.toLowerCase().replace(/\s+/g, '-')}`}
            disabled={!isComplete}
          />
          <button
            onClick={handleSalvar}
            disabled={!isComplete || saving}
            className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-5 py-2 rounded-lg text-sm transition-colors"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <PlayerPickerModal
          players={allPlayers}
          selectedIds={picks.map(p => p.id)}
          posicaoFiltro={modal.posicao}
          onSelect={handleSelect}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
