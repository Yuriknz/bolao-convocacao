import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { entrarNoBolao } from '@/app/actions/bolao'

interface Props {
  params: Promise<{ invite_code: string }>
}

export default async function JoinPage({ params }: Props) {
  const { invite_code } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/join/${invite_code}`)
  }

  // verificar se bolão existe antes de mostrar tela
  const { data: bolao } = await supabase
    .from('bolaos')
    .select('id, nome, fechado')
    .eq('invite_code', invite_code)
    .single()

  if (!bolao) {
    return (
      <div className="min-h-screen bg-[#0f1923] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 text-lg font-semibold">Link inválido</p>
          <p className="text-gray-400 mt-2 text-sm">Este convite não existe ou expirou.</p>
        </div>
      </div>
    )
  }

  if (bolao.fechado) {
    return (
      <div className="min-h-screen bg-[#0f1923] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-yellow-400 text-lg font-semibold">Bolão fechado</p>
          <p className="text-gray-400 mt-2 text-sm">Este bolão não aceita mais participantes.</p>
        </div>
      </div>
    )
  }

  // verificar se já é membro
  const { data: membro } = await supabase
    .from('bolao_members')
    .select('bolao_id')
    .eq('bolao_id', bolao.id)
    .eq('user_id', user.id)
    .single()

  if (membro) {
    redirect(`/bolao/${bolao.id}`)
  }

  async function entrar() {
    'use server'
    await entrarNoBolao(invite_code)
  }

  return (
    <div className="min-h-screen bg-[#0f1923] flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Você foi convidado!</h1>
        <p className="text-gray-400 mb-1">Bolão:</p>
        <p className="text-yellow-400 text-xl font-semibold mb-8">{bolao.nome}</p>

        <form action={entrar}>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors"
          >
            Entrar no bolão
          </button>
        </form>
      </div>
    </div>
  )
}
