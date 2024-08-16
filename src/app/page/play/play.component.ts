import { BoardComponent } from '@/app/components/board/board.component'
import { DetailsGameComponent } from '@/app/components/details-game/details-game.component'
import { ModalFullscreenComponent } from '@/app/components/modal-fullscreen/modal-fullscreen.component'
import { GameState, GameStateValues } from '@/app/interfaces/game'
import { RoomService } from '@/app/services/room.service'
import { UserService } from '@/app/services/user.service'
import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-play',
  standalone: true,
  imports: [BoardComponent, DetailsGameComponent, ModalFullscreenComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements OnInit, OnDestroy {
  protected readonly roomService = inject(RoomService)
  protected readonly userService = inject(UserService)
  protected readonly isPrivate = input()
  protected readonly id = input<string>()
  protected readonly router = inject(Router)

  statesModal: GameStateValues[] = [
    GameState.VICTORY_PLAYER1,
    GameState.VICTORY_PLAYER2,
    GameState.FINAL_VICTORY_PLAYER1,
    GameState.ABANDONED,
    GameState.DRAW,
    GameState.WAITING_FOR_PARTNER
  ]
  protected readonly isCopyLink = signal<boolean>(false)
  protected readonly isModalVisible = computed(() => this.statesModal.includes(this.roomService.stateGame()))
  private subscriptions = new Subscription()
  async copyLink() {
    const roomId = this.roomService.getRoomId()
    const url = `${window.location.origin}/play/${roomId}`
    try {
      await navigator.clipboard.writeText(url)
      this.isCopyLink.set(true)
    } catch (error) {
      console.log('error copiando el link', error)
    }
  }
  async ngOnInit() {
    if (!this.isPrivate() && !this.id()) this.roomService.createRoom('public')
    if (this.isPrivate() && !this.id()) this.roomService.createRoom('private')
    if (this.id()) {
      const room = await this.roomService.joinRoom(this.id() ?? '')
      !room.success && this.router.navigate(['/'])
    }

    const playerJoinedSubscription = this.roomService.onPlayerJoined()
    const playerLeftSubscription = this.roomService.onPlayerLeft()
    const playerMoveSubscription = this.roomService.onPlayerMove()
    const gameNewTurnSubscription = this.roomService.onGameNewTurn()

    this.subscriptions.add(playerJoinedSubscription)
    this.subscriptions.add(playerMoveSubscription)
    this.subscriptions.add(playerLeftSubscription)
    this.subscriptions.add(gameNewTurnSubscription)
  }
  ngOnDestroy() {
    this.roomService.leaveRoom(this.roomService.getRoomId()).catch((error) => console.error('Error al abandonar la sala', error))
    this.subscriptions.unsubscribe()
  }
}
