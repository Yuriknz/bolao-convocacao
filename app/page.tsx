import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Se já é membro de algum bolão, vai direto pra ele
  const { data: membro } = await supabase
    .from('bolao_members')
    .select('bolao_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (membro) redirect(`/bolao/${membro.bolao_id}`)

  redirect('/bolao/new')
}
