import { inject, Injectable } from '@angular/core'
import { io, type Socket } from 'socket.io-client'
import type { Room } from '@/app/page/play/game.types'
import { UserService } from './user.service'
import type { ResponsePlayerLeft, ResponsePlayerJoined, ResponseCommonRoom, ResponseSearchRoom } from './types/server'
import { Observable } from 'rxjs'
import { CONFIG } from '@/config'

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
      const res: ResponseSearchRoom = await this.server.timeout(CONFIG.SOCKET_TIMEOUT).emitWithAck('searchRoom')
      return res
    } catch (_e) {
      throw new Error('Error al conectar con el evento')
    }
  }

  async createRoom(type: Room['type']) {
    try {
      const res: ResponseCommonRoom = await this.server
        .timeout(CONFIG.SOCKET_TIMEOUT)
        .emitWithAck('createRoom', { type, player: this.userService.name() })
      return res
    } catch (_e) {
      throw new Error('Error al conectar con el evento')
    }
  }

  async joinRoom(roomId: Room['id']) {
    try {
      const res: ResponseCommonRoom = await this.server
        .timeout(CONFIG.SOCKET_TIMEOUT)
        .emitWithAck('joinRoom', { roomId, playerName: this.userService.name() })
      return res
    } catch (_e) {
      throw new Error('Error al conectar con el evento')
    }
  }

  onPlayerJoined(): Observable<ResponsePlayerJoined> {
    return new Observable<ResponsePlayerJoined>((observer) => {
      const handler = (data: ResponsePlayerJoined) => observer.next(data)
      this.server.on('playerJoined', handler)
      return () => {
        this.server.off('playerJoined', handler)
      }
    })
  }

  onPlayerLeft(): Observable<ResponsePlayerLeft> {
    return new Observable<ResponsePlayerLeft>((observer) => {
      const handler = (data: ResponsePlayerLeft) => observer.next(data)
      this.server.on('playerLeft', handler)
      return () => {
        this.server.off('playerLeft', handler)
      }
    })
  }

  async leaveRoom(roomId: Room['id']) {
    try {
      const response: string = await this.server
        .timeout(CONFIG.SOCKET_TIMEOUT)
        .emitWithAck('leaveRoom', { roomId, playerName: this.userService.name() })
      return response
    } catch (_e) {
      throw new Error('Error al conectar con el evento')
    }
  }
}
