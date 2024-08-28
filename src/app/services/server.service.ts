import { inject, Injectable, signal } from '@angular/core'
import { io, type Socket } from 'socket.io-client'
import { UserService } from './user.service'
import type { ResponsePlayerLeft, ResponsePlayerJoined } from './types/server'
import { Observable } from 'rxjs'
import { Room } from '../interfaces/game'

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private connected = false
  server: Socket
  userService = inject(UserService)
  roomId = signal<string>('')

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
  private createObservable<Data>(event: string): Observable<Data> {
    return new Observable<Data>((observer) => {
      const handler = (data: Data) => observer.next(data)
      this.server.on(event, handler)
      return () => {
        this.server.off(event, handler)
      }
    })
  }
  onPlayerJoined() {
    return this.createObservable<ResponsePlayerJoined>('playerJoined')
  }
  onPlayerMove() {
    return this.createObservable<Room>('makeMove')
  }
  onGameNewTurn() {
    return this.createObservable<Room>('newTurn')
  }
  onVoteForNewGame() {
    return this.createObservable<Room>('voteForNewGame')
  }
  onPlayerLeft() {
    return this.createObservable<ResponsePlayerLeft>('playerLeft')
  }
}
