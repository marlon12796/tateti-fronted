import { GameState, PlayerTurn, type Room } from '@/app/interfaces/game'

export interface ResponsePlayerJoined {
  message: string
  room: Room
}
export interface ResponsePlayerLeft {
  playerName: string
  room: Room
  numberPlayer: number
}
export interface ResponsePlayerTurn {
  playerTurn: PlayerTurn
  boardGame: (PlayerTurn | '')[]
  gameState: GameState
}
export interface ResponseCommonRoom {
  success: boolean
  room: Room
  message: string
}
export type ResponseRoomLeft = ResponseCommonRoom & {
  numberPlayer: number
}
export interface ResponseSearchRoom {
  roomId: string | null
}
