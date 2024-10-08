import { BoardComponent } from '@/app/components/board/board.component'
import { DetailsGameComponent } from '@/app/components/details-game/details-game.component'
import { ModalFullscreenComponent } from '@/app/components/modal-fullscreen/modal-fullscreen.component'
import { SvgModalComponent } from '@/app/components/svg-modal/svg-modal.component'
import { GameState, GameStateValues } from '@/app/interfaces/game'
import { RoomService } from '@/app/services/room.service'
import { UserService } from '@/app/services/user.service'
import { Location } from '@angular/common'
import { Component, computed, HostListener, inject, input, OnDestroy, OnInit, signal } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-play',
  standalone: true,
  imports: [BoardComponent, DetailsGameComponent, ModalFullscreenComponent, SvgModalComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements OnInit, OnDestroy {
  protected readonly roomService = inject(RoomService)
  protected readonly userService = inject(UserService)
  protected readonly isPrivate = input()
  protected readonly id = input<string>()
  protected readonly router = inject(Router)
  protected readonly location = inject(Location)
  statesModal: GameStateValues[] = [
    GameState.VICTORY_PLAYER1,
    GameState.VICTORY_PLAYER2,
    GameState.FINAL_VICTORY_PLAYER1,
    GameState.FINAL_VICTORY_PLAYER2,
    GameState.ABANDONED,
    GameState.DRAW,
    GameState.WAITING_FOR_PARTNER,
    GameState.VOTING_FOR_NEW_GAME
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
    this.location.replaceState('play')
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
    const voteForNewGame = this.roomService.onVoteForNewGame()

    this.subscriptions.add(playerJoinedSubscription)
    this.subscriptions.add(playerMoveSubscription)
    this.subscriptions.add(playerLeftSubscription)
    this.subscriptions.add(gameNewTurnSubscription)
    this.subscriptions.add(voteForNewGame)
  }
  ngOnDestroy() {
    this.cleanup()
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification() {
    this.cleanup()
  }
  private cleanup(): void {
    this.roomService.leaveRoom(this.roomService.getRoomId())
    this.subscriptions.unsubscribe()
  }
}
