import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import EscalacaoClient from '@/components/escalacao/EscalacaoClient'
import type { Player } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function BolaoPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Carregar bolão (RLS garante que só membros/admin veem)
  const { data: bolao } = await supabase
    .from('bolaos')
    .select('id, nome, invite_code, admin_id, fechado')
    .eq('id', id)
    .single()

  if (!bolao) notFound()

  // Carregar lista de jogadores
  const { data: players } = await supabase
    .from('pre_lista_players')
    .select('id, nome, clube, posicao')
    .order('posicao')
    .order('nome')

  // Carregar convocação existente (se houver)
  const { data: convocacao } = await supabase
    .from('convocacoes')
    .select('player_ids')
    .eq('bolao_id', id)
    .eq('user_id', user.id)
    .single()

  const allPlayers = (players ?? []) as Player[]

  // Reconstituir picks na ordem original
  let initialPicks: Player[] = []
  if (convocacao?.player_ids) {
    const playerMap = new Map(allPlayers.map(p => [p.id, p]))
    initialPicks = convocacao.player_ids
      .map((pid: number) => playerMap.get(pid))
      .filter(Boolean) as Player[]
  }

  return (
    <EscalacaoClient
      allPlayers={allPlayers}
      initialPicks={initialPicks}
      bolaoId={bolao.id}
      bolaoNome={bolao.nome}
      inviteCode={bolao.invite_code}
      isAdmin={bolao.admin_id === user.id}
    />
  )
}
