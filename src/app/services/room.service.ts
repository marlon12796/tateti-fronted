import { inject, Injectable, signal } from '@angular/core'
import { ServerService } from './server.service'
import type { Room } from '@/app/page/play/game.types'
import type { ResponseCommonRoom, ResponseSearchRoom } from './types/server'
import { CONFIG } from '@/config'
import { type GameState } from './types/room'

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private serverService = inject(ServerService)
  readonly player1 = signal<string>('')
  readonly player2 = signal<string>('')
  readonly stateGame = signal<GameState>('WAITING_FOR_PARTNER')
  async searchRoomPublic(): Promise<ResponseSearchRoom> {
    try {
      const res: ResponseSearchRoom = await this.serverService.server.timeout(CONFIG.SOCKET_TIMEOUT).emitWithAck('searchRoom')
      console.log(res)
      return res
    } catch (_e) {
      throw new Error('Error al conectar con el evento')
    }
  }

  async createRoom(type: Room['type']): Promise<ResponseCommonRoom> {
    try {
      const res: ResponseCommonRoom = await this.serverService.server
        .timeout(CONFIG.SOCKET_TIMEOUT)
        .emitWithAck('createRoom', { type, player: this.serverService.userService.name() })
      this.serverService.roomId.set(res.room.id)
      this.handleRoomUpdate(res.room.players)
      return res
    } catch (_e) {
      throw new Error('Error al conectar con el evento')
    }
  }

  async joinRoom(roomId: Room['id']): Promise<ResponseCommonRoom> {
    try {
      const res: ResponseCommonRoom = await this.serverService.server
        .timeout(CONFIG.SOCKET_TIMEOUT)
        .emitWithAck('joinRoom', { roomId, playerName: this.serverService.userService.name() })
      if (res.room.id) {
        this.serverService.roomId.set(res.room.id)
        this.handleRoomUpdate(res.room.players)
      }
      return res
    } catch (_e) {
      throw new Error('Error al conectar con el evento')
    }
  }

  async leaveRoom(roomId: Room['id']): Promise<string> {
    try {
      const response: string = await this.serverService.server
        .timeout(CONFIG.SOCKET_TIMEOUT)
        .emitWithAck('leaveRoom', { roomId, playerName: this.serverService.userService.name() })
      console.log(response)
      return response
    } catch (_e) {
      throw new Error('Error al conectar con el evento')
    }
  }

  onPlayerJoined() {
    return this.serverService.onPlayerJoined().subscribe((data) => {
      this.handleRoomUpdate(data.room.players)
    })
  }
  getRoomId() {
    return this.serverService.roomId()
  }
  onPlayerLeft() {
    return this.serverService.onPlayerLeft().subscribe((data) => {
      this.handleRoomUpdate(data.room.players)
    })
  }
  private handleRoomUpdate(players: Room['players']) {
    this.player1.set(players[0].name)
    this.player2.set(players[1].name)
  }
}
