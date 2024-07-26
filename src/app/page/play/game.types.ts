import { type GameState } from '@/app/services/types/room'

export interface Player {
  name: string
  health: number
}
export interface Room {
  id: string
  type: 'public' | 'private'
  players: [Player, Player]
  state: GameState
}
export enum PlayerTurn {
  PLAYER_1 = 0,
  PLAYER_2 = 1
}
