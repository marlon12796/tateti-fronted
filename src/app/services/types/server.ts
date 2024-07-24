import { type Room } from '@/app/page/play/game.types'

export interface ResponsePlayerJoined {
  message: string
  room: Room
}
export interface ResponsePlayerLeft {
  playerName: string
  room: Room
}
export interface ResponseCommonRoom {
  success: boolean
  room: Room
  message: string
}
export interface ResponseSearchRoom {
  roomId: string | null
}
