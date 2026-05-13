import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Trophy, ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

function displayName(email: string) {
  return email.split('@')[0]
}

export default async function RankingPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bolao } = await supabase
    .from('bolaos')
    .select('id, nome')
    .eq('id', id)
    .single()

  if (!bolao) notFound()

  const { data: ranking } = await supabase.rpc('get_ranking', { p_bolao_id: id })
  const { data: gabarito } = await supabase
    .from('gabaritos')
    .select('bolao_id')
    .eq('bolao_id', id)
    .single()

  const temGabarito = !!gabarito
  const rows = (ranking ?? []) as { user_id: string; email: string; pontos: number; updated_at: string }[]

  return (
    <div className="min-h-screen bg-[#0d1520] text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
        <Link
          href={`/bolao/${id}`}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-bold text-white">{bolao.nome}</h1>
          <p className="text-xs text-gray-500">Ranking</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Alerta gabarito */}
        {!temGabarito && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
            <Trophy className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-300 font-semibold text-sm">Gabarito ainda não publicado</p>
              <p className="text-gray-400 text-xs mt-0.5">
                Os pontos serão calculados quando o admin publicar a convocação real do Ancelotti.
              </p>
            </div>
          </div>
        )}

        {/* Tabela */}
        {rows.length === 0 ? (
          <p className="text-gray-500 text-center py-12 text-sm">
            Nenhum participante enviou convocação ainda.
          </p>
        ) : (
          <div className="space-y-2">
            {rows.map((row, index) => {
              const pos = index + 1
              const isMe = row.user_id === user.id
              return (
                <div
                  key={row.user_id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors
                    ${isMe
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-gray-800/40 border-gray-700/50'
                    }`}
                >
                  {/* Posição */}
                  <span className="text-lg w-8 text-center shrink-0">
                    {MEDAL[pos] ?? <span className="text-gray-500 text-sm font-bold">{pos}º</span>}
                  </span>

                  {/* Nome */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold truncate ${isMe ? 'text-yellow-300' : 'text-white'}`}>
                      {displayName(row.email)}
                      {isMe && <span className="text-yellow-500/60 text-xs font-normal ml-2">você</span>}
                    </p>
                  </div>

                  {/* Pontos */}
                  <div className="text-right shrink-0">
                    {temGabarito ? (
                      <span className={`text-lg font-bold ${pos === 1 ? 'text-yellow-400' : 'text-white'}`}>
                        {row.pontos} <span className="text-xs font-normal text-gray-400">pts</span>
                      </span>
                    ) : (
                      <span className="text-gray-600 text-sm">—</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Minha convocação */}
        <div className="mt-6">
          <Link
            href={`/bolao/${id}`}
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-full"
          >
            Ver minha escalação
          </Link>
        </div>
      </div>
    </div>
  )
}
