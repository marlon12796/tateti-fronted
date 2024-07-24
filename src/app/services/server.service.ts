import { inject, Injectable } from '@angular/core'
import { io, type Socket } from 'socket.io-client'
import type { Room } from '@/app/page/play/game.types'
import { UserService } from './user.service'
import { type ResponsePlayerJoined } from './types/server'

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private connected = false
  private server: Socket
  private userService = inject(UserService)
  constructor() {
    this.server = io('http://localhost:3000', { autoConnect: false })
    this.server.on('connect', () => {
      this.connected = true
      console.log('Connected to the server')
    })

    this.server.on('disconnect', () => {
      this.connected = false
      console.log('Disconnected from the server')
    })
  }
  connect() {
    if (!this.connected) this.server.connect()
  }
  isConnected() {
    return this.connected
  }
  async searchRoomPublic() {
    try {
      const res: { roomId: string | null } = await this.server.timeout(5000).emitWithAck('searchRoom')
      return res
    } catch (_e) {
      throw new Error('Error al conectar con el evento')
    }
  }
  async createRoom(type: Room['type']) {
    try {
      const res = await this.server.timeout(5000).emitWithAck('createRoom', { type, player: this.userService.name() })
      return res
    } catch (_e) {
      throw new Error('Error al conectar con el evento')
    }
  }
  async joinRoom(roomId: Room['id']) {
    try {
      const res = await this.server.timeout(5000).emitWithAck('joinRoom', { roomId, playerName: this.userService.name() })
      return res
    } catch (_e) {
      throw new Error('Error al conectar con el evento')
    }
  }
  onPlayerJoined(callback: (data: ResponsePlayerJoined) => void) {
    this.server.on('playerJoined', callback)
  }
}
