import { computed, inject, Injectable, signal } from '@angular/core'
import { ServerService } from './server.service'
import { PlayerTurn, type Player, type Room } from '@/app/page/play/game.types'
import type { ResponseCommonRoom, ResponseSearchRoom } from './types/server'
import { CONFIG } from '@/config'
import { GameState } from './types/room'

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly serverService = inject(ServerService)
  readonly player1 = signal<Player>({ health: 0, name: '' })
  readonly player2 = signal<Player>({ health: 0, name: '' })
  readonly stateGame = signal<GameState>(GameState['WAITING_FOR_PARTNER'])
  readonly numberPlayer = signal<PlayerTurn | null>(null)
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
      this.numberPlayer.set(PlayerTurn['PLAYER_1'])
      this.handleRoomUpdate(res.room)
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
        this.handleRoomUpdate(res.room)
        this.numberPlayer.set(PlayerTurn['PLAYER_2'])
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
      this.handleRoomUpdate(data.room)
    })
  }
  getRoomId() {
    return this.serverService.roomId()
  }
  onPlayerLeft() {
    return this.serverService.onPlayerLeft().subscribe((data) => {
      this.handleRoomUpdate(data.room)
    })
  }
  private handleRoomUpdate(room: Room) {
    this.player1.set({ health: room.players[0].health, name: room.players[0].name })
    this.player2.set({ health: room.players[1].health, name: room.players[1].name })
    this.stateGame.set(room.state)
  }
}
