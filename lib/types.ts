export type Posicao = 'GOL' | 'DEF' | 'MEI' | 'ATA'

export interface Player {
  id: number
  nome: string
  clube: string
  posicao: Posicao
}

export interface Bolao {
  id: string
  nome: string
  invite_code: string
  admin_id: string
  fechado: boolean
  created_at: string
}

export interface Convocacao {
  id: string
  user_id: string
  bolao_id: string
  player_ids: number[]
  pontos: number
  updated_at: string
}

export interface BolaoMember {
  bolao_id: string
  user_id: string
  joined_at: string
}
