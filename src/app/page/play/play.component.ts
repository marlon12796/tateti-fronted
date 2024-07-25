import { BoardComponent } from '@/app/components/board/board.component'
import { DetailsGameComponent } from '@/app/components/details-game/details-game.component'
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
  serverService = inject(ServerService)
  userService = inject(UserService)
  isPrivate = input()
  id = input<string>()
  private subscriptions = new Subscription()
  ngOnInit() {
    if (!this.isPrivate() && !this.id()) this.serverService.createRoom('public')
    if (this.isPrivate() && !this.id()) this.serverService.createRoom('private')
    if (this.id()) this.serverService.joinRoom(this.id() ?? '')

    const playerJoinedSubscription = this.serverService.onPlayerJoined().subscribe((data) => {
      console.log('jugadorUnido', data.message)
    })

    const playerLeftSubscription = this.serverService.onPlayerLeft().subscribe((data) => {
      console.log('Jugador se QUito', data)
    })
    this.subscriptions.add(playerJoinedSubscription)
    this.subscriptions.add(playerLeftSubscription)
  }
  ngOnDestroy() {
    this.serverService
      .leaveRoom(this.serverService.getRoomId())
      .catch((error) => console.error('Error al abandonar la sala', error))
    this.subscriptions.unsubscribe()
  }
}
