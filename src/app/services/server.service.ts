import { inject, Injectable, signal } from '@angular/core'
import { io, type Socket } from 'socket.io-client'
import { UserService } from './user.service'
import type { ResponsePlayerLeft, ResponsePlayerJoined, ResponseCommonRoom, ResponseSearchRoom } from './types/server'
import { Observable } from 'rxjs'

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
  onPlayerJoined(): Observable<ResponsePlayerJoined> {
    return this.createObservable<ResponsePlayerJoined>('playerJoined')
  }

  onPlayerLeft(): Observable<ResponsePlayerLeft> {
    return this.createObservable<ResponsePlayerLeft>('playerLeft')
  }
}
