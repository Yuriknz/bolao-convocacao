'use client'

import { useActionState } from 'react'
import { criarBolao } from '@/app/actions/bolao'

export default function NovoBolaoPage() {
  const [state, action, pending] = useActionState(criarBolao, null)

  return (
    <div className="min-h-screen bg-[#0f1923] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Criar bolão</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Você será o admin e poderá compartilhar o link de convite.
          </p>
        </div>

        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm text-gray-400 mb-1">
              Nome do bolão
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              placeholder="Ex: Galera do trampo 2026"
              className="w-full bg-[#1a2535] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>

          {state?.erro && (
            <p className="text-red-400 text-sm">{state.erro}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-3 rounded-lg transition-colors"
          >
            {pending ? 'Criando...' : 'Criar bolão'}
          </button>
        </form>
      </div>
    </div>
  )
}
