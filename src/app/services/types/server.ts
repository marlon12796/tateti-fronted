import { type Room } from '@/app/page/play/game.types'

export interface ResponsePlayerJoined {
  message: string
  room: Room
}
