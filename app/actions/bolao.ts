'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { nanoid } from '@/lib/nanoid'

export async function criarBolao(
  _prev: { erro: string } | null,
  formData: FormData
): Promise<{ erro: string } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const nome = formData.get('nome') as string
  if (!nome?.trim()) return { erro: 'Nome obrigatório' }

  const invite_code = nanoid(8)

  const { data: bolao, error } = await supabase
    .from('bolaos')
    .insert({ nome: nome.trim(), invite_code, admin_id: user.id })
    .select('id')
    .single()

  if (error) return { erro: error.message }

  await supabase
    .from('bolao_members')
    .insert({ bolao_id: bolao.id, user_id: user.id })

  redirect(`/bolao/${bolao.id}`)
}

export async function entrarNoBolao(inviteCode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/join/${inviteCode}`)

  const { data, error } = await supabase.rpc('join_bolao', {
    p_invite_code: inviteCode,
  })

  if (error) return { erro: error.message }

  redirect(`/bolao/${data}`)
}
