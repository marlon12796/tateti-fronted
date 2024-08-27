import { GameState } from '@/app/interfaces/game'
import { RoomService } from '@/app/services/room.service'
import { UserService } from '@/app/services/user.service'
import { animate, query, stagger, style, transition, trigger } from '@angular/animations'
import { Component, computed, inject, Input, effect } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ButtonComponent } from '../button/button.component'

@Component({
  selector: 'app-modal-fullscreen',
  standalone: true,
  imports: [RouterModule, ButtonComponent],
  templateUrl: './modal-fullscreen.component.html',
  styleUrl: './modal-fullscreen.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('0.5s ease-in-out', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('0.5s ease-in', style({ opacity: 0 }))])
    ]),
    trigger('slideInFromRight', [
      transition(':enter', [
        query('.animate', style({ transform: 'translateX(400px)' })),
        query('.animate-2', style({ transform: 'translateX(400px)' })),
        //animate
        query('.animate', [animate('250ms ease-in-out', style({ transform: 'translateX(0)' }))]),
        query('.animate-2', [animate('250ms ease-in-out', style({ transform: 'translateX(0)' }))])
      ]),
      transition(':leave', [
        query('.animate', style({ transform: 'translateX(0px)' })),
        query('.animate-2', style({ transform: 'translateX(0px)' })),
        //animate
        query('.animate', [animate('200ms ease-in', style({ transform: 'translateX(-400px)' }))]),
        query('.animate-2', [animate('200ms ease-in', style({ transform: 'translateX(-400px)' }))])
      ])
    ])
  ]
})
export class ModalFullscreenComponent {
  @Input() isModalVisible = true
  protected roomService = inject(RoomService)
  protected userService = inject(UserService)
  protected dots: number[] = [1, 2, 3]
  protected readonly isReturnButtonVisible = computed(() => {
    const isReturn = [
      GameState.WAITING_FOR_PARTNER,
      GameState.ABANDONED,
      GameState.FINAL_VICTORY_PLAYER1,
      GameState.FINAL_VICTORY_PLAYER2,
      GameState.VOTING_FOR_NEW_GAME
    ].includes(this.roomService.stateGame())
    return isReturn
  })
  protected readonly textTitle = computed(() => {
    const state = this.roomService.stateGame()
    const titleMap = new Map([
      [GameState.VICTORY_PLAYER1, `Ganó ${this.roomService.player1().name}`],
      [GameState.VICTORY_PLAYER2, `Ganó ${this.roomService.player2().name}`],
      [GameState.WAITING_FOR_PARTNER, 'BUSCANDO COMPAÑERO'],
      [GameState.FINAL_VICTORY_PLAYER1, `Ganador Final ${this.roomService.player1().name}`],
      [GameState.FINAL_VICTORY_PLAYER2, `Ganador Final ${this.roomService.player2().name}`],
      [GameState.ABANDONED, 'El otro jugador ha salido'],
      [GameState.DRAW, `Los jugadores empataron`],
      [GameState.VOTING_FOR_NEW_GAME, `Vota para el próximo juego`]
    ])
    return titleMap.get(state) || ''
  })
  protected readonly buttonTitle = computed(() => {
    const state = this.roomService.stateGame()
    const validationVictory =
      state === GameState.VICTORY_PLAYER1 || state === GameState.VICTORY_PLAYER2 || state === GameState.DRAW
    const validationFinalVictory = state === GameState.FINAL_VICTORY_PLAYER1 || state === GameState.FINAL_VICTORY_PLAYER2
    const validationWaiting = state === GameState.VOTING_FOR_NEW_GAME && this.roomService.isPlayerVotingForNewGame()
    const validationWaitingNotPlayer =
      state === GameState.VOTING_FOR_NEW_GAME && !this.roomService.isPlayerVotingForNewGame()
    if (validationVictory) return 'Próxima Ronda'
    if (validationFinalVictory || validationWaitingNotPlayer) return 'Nueva Partida'
    if (validationWaiting) return 'Esperando...'
    return ''
  })
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
    console.log(validationWaitingNotPlayer)
    console.log(this.roomService.isPlayerVotingForNewGame())
    if (!validationWaitingNotPlayer) return this.roomService.voteForNewGame()
    return
  }
}
