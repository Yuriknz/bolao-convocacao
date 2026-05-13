import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 })
  }

  const { bolaoId, playerIds } = await request.json()

  if (!bolaoId || !Array.isArray(playerIds) || playerIds.length !== 26) {
    return NextResponse.json({ erro: 'Dados inválidos' }, { status: 400 })
  }

  // Verificar se bolão está aberto
  const { data: bolao } = await supabase
    .from('bolaos')
    .select('fechado')
    .eq('id', bolaoId)
    .single()

  if (!bolao || bolao.fechado) {
    return NextResponse.json({ erro: 'Bolão fechado' }, { status: 403 })
  }

  const { error } = await supabase
    .from('convocacoes')
    .upsert(
      { user_id: user.id, bolao_id: bolaoId, player_ids: playerIds, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,bolao_id' }
    )

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
