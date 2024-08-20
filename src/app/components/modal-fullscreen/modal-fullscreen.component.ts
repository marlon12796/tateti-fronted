import { GameState } from '@/app/interfaces/game'
import { RoomService } from '@/app/services/room.service'
import { UserService } from '@/app/services/user.service'
import { animate, animateChild, query, style, transition, trigger } from '@angular/animations'
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
    trigger('animateChildren', [transition('* => void', [query('@*', [animateChild()])])]),
    trigger('slideInFromRight', [
      transition(':enter', [
        style({ translate: '400px', opacity: 0 }),
        animate('0.5s ease-in-out', style({ translate: '0', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ translate: '0', opacity: 1 }),
        animate('0.5s ease-in-out', style({ translate: '-400px', opacity: 0 }))
      ])
    ]),
    trigger('slideInFromRight1', [
      transition(':enter', [style({ translate: '400px' }), animate('0.5s 0.1s ease-in-out', style({ translate: 0 }))]),
      transition(':leave', [style({ translate: 0 }), animate('0.5s 0.1s ease-out', style({ translate: '-400px' }))])
    ]),
    trigger('slideInFromRight2', [
      transition(':enter', [style({ translate: '400px' }), animate('0.5s 0.2s ease-in-out', style({ translate: 0 }))]),
      transition(':leave', [style({ translate: 0 }), animate('0.5s 0.5s ease-out', style({ translate: '-400px' }))])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('0.5s ease-in-out', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('0.5s ease-out', style({ opacity: 0 }))])
    ])
  ]
})
export class ModalFullscreenComponent {
  @Input({ required: true }) isModalVisible = false
  protected roomService = inject(RoomService)
  protected userService = inject(UserService)
  protected dots: number[] = [1, 2, 3]
  protected readonly isReturnButtonVisible = computed(() => {
    const isReturn = [GameState.WAITING_FOR_PARTNER, GameState.ABANDONED].includes(this.roomService.stateGame())
    return isReturn
  })
  protected readonly textTitle = computed(() => {
    const state = this.roomService.stateGame()
    const titleMap = new Map([
      [GameState.VICTORY_PLAYER1, `Ganó ${this.roomService.player1().name}`],
      [GameState.VICTORY_PLAYER2, `Ganó ${this.roomService.player2().name}`],
      [GameState.WAITING_FOR_PARTNER, 'BUSCANDO COMPAÑERO'],
      [GameState.FINAL_VICTORY_PLAYER1, `El ganador final es ${this.roomService.player1().name}`],
      [GameState.FINAL_VICTORY_PLAYER2, `El ganador final es ${this.roomService.player2().name}`],
      [GameState.ABANDONED, 'El otro jugador ha salido'],
      [GameState.DRAW, `Los jugadores empataron`]
    ])
    return titleMap.get(state) || ''
  })
  protected readonly buttonTitle = computed(() => {
    const state = this.roomService.stateGame()
    const validationVictory = state === GameState.VICTORY_PLAYER1 || state === GameState.VICTORY_PLAYER2 || state === GameState.DRAW
    const validationFinalVictory = state === GameState.FINAL_VICTORY_PLAYER1 || state === GameState.FINAL_VICTORY_PLAYER2

    return validationVictory ? 'Próxima Ronda' : validationFinalVictory ? 'Nueva Partida' : ''
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

  newTurn() {
    console.log(this.roomService.stateGame())
    this.roomService.requestNewTurn()
  }
}
