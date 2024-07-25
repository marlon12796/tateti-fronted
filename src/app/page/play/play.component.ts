import { BoardComponent } from '@/app/components/board/board.component'
import { DetailsGameComponent } from '@/app/components/details-game/details-game.component'
import { RoomService } from '@/app/services/room.service'
import { ServerService } from '@/app/services/server.service'
import { UserService } from '@/app/services/user.service'
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-play',
  standalone: true,
  imports: [BoardComponent, DetailsGameComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements OnInit, OnDestroy {
  roomService = inject(RoomService)
  userService = inject(UserService)
  isPrivate = input()
  id = input<string>()
  private subscriptions = new Subscription()
  ngOnInit() {
    if (!this.isPrivate() && !this.id()) this.roomService.createRoom('public')
    if (this.isPrivate() && !this.id()) this.roomService.createRoom('private')
    if (this.id()) this.roomService.joinRoom(this.id() ?? '')

    const playerJoinedSubscription = this.roomService.onPlayerJoined()
    const playerLeftSubscription = this.roomService.onPlayerLeft()
    
    this.subscriptions.add(playerJoinedSubscription)
    this.subscriptions.add(playerLeftSubscription)
  }
  ngOnDestroy() {
    this.roomService.leaveRoom(this.roomService.getRoomId()).catch((error) => console.error('Error al abandonar la sala', error))
    this.subscriptions.unsubscribe()
  }
}
