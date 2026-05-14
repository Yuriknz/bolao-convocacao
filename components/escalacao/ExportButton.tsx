'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

interface Props {
  targetId: string
  filename: string
  disabled: boolean
}

export default function ExportButton({ targetId, filename, disabled }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    if (disabled) return
    setLoading(true)

    const el = document.getElementById(targetId)
    if (!el) { setLoading(false); return }

    const { toPng } = await import('html-to-image')

    const dataUrl = await toPng(el, {
      backgroundColor: '#0d1520',
      pixelRatio: 2,
    })

    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = dataUrl
    link.click()

    setLoading(false)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || loading}
      className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
    >
      <Download className="w-4 h-4" />
      {loading ? 'Gerando...' : 'Baixar imagem'}
    </button>
  )
}
