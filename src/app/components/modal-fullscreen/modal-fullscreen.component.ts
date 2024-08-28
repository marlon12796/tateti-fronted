import { GameState } from '@/app/interfaces/game'
import { RoomService } from '@/app/services/room.service'
import { UserService } from '@/app/services/user.service'
import { Component, computed, inject, Input, effect } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ButtonComponent } from '../button/button.component'
import { animationsModal } from './modal.animation'
import { getButtonTitle, getTextTitle, isReturnButtonVisible } from '@/app/utils/modal-fullscreen.utils'

@Component({
  selector: 'app-modal-fullscreen',
  standalone: true,
  imports: [RouterModule, ButtonComponent],
  templateUrl: './modal-fullscreen.component.html',
  styleUrl: './modal-fullscreen.component.scss',
  animations: [animationsModal.fadeInOutAnimation, animationsModal.slideInFromRight]
})
export class ModalFullscreenComponent {
  @Input() isModalVisible = true
  protected roomService = inject(RoomService)
  protected userService = inject(UserService)
  protected dots: number[] = [1, 2, 3]
  protected readonly isReturnButtonVisible = computed(() => isReturnButtonVisible(this.roomService))
  protected readonly textTitle = computed(() => getTextTitle(this.roomService))
  protected readonly buttonTitle = computed(() => getButtonTitle(this.roomService))
  constructor() {
    effect(async (onCleanup) => {
      const state = this.roomService.stateGame()
      const validationFinalVictory = state === GameState.FINAL_VICTORY_PLAYER1 || state === GameState.FINAL_VICTORY_PLAYER2
      if (validationFinalVictory) {
        const confetti = (await import('canvas-confetti')).default
        const timer = setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })
        }, 1000)
        onCleanup(() => {
          clearTimeout(timer)
        })
      }
    })
  }

  executeGameAction() {
    const statesNewTurn: GameState[] = [GameState.VICTORY_PLAYER1, GameState.VICTORY_PLAYER2, GameState.DRAW]
    const isNewTurn = statesNewTurn.includes(this.roomService.stateGame())
    if (isNewTurn) return this.roomService.requestNewTurn()

    const validationWaitingNotPlayer = this.roomService.isPlayerVotingForNewGame()

    if (!validationWaitingNotPlayer) return this.roomService.voteForNewGame()
    return
  }
}
