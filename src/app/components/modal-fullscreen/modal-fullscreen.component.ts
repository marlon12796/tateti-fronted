import { GameState } from '@/app/interfaces/game'
import { RoomService } from '@/app/services/room.service'
import { UserService } from '@/app/services/user.service'
import { animate, animateChild, query, style, transition, trigger } from '@angular/animations'
import { Component, computed, inject, Input } from '@angular/core'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-modal-fullscreen',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './modal-fullscreen.component.html',
  styleUrl: './modal-fullscreen.component.scss',
  animations: [
    trigger('animateChildren', [transition('* => void', [query('@*', [animateChild()])])]),
    trigger('slideInFromRight', [
      transition(':enter', [style({ translate: '400px', opacity: 0 }), animate('0.5s ease-in-out', style({ translate: '0', opacity: 1 }))]),
      transition(':leave', [style({ translate: '0', opacity: 1 }), animate('0.5s ease-in-out', style({ translate: '-400px', opacity: 0 }))])
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
  protected dots: number[] = [1, 2, 3, 4, 5]
  protected readonly textTitle = computed(() => {
    const state = this.roomService.stateGame()
    const titleMap = new Map([
      [GameState.VICTORY_PLAYER1, `Ganó ${this.roomService.player1().name}`],
      [GameState.VICTORY_PLAYER2, `Ganó ${this.roomService.player2().name}`],
      [GameState.WAITING_FOR_PARTNER, 'Esperando Compañero'],
      [GameState.FINAL_VICTORY_PLAYER1, `Ganó ${this.roomService.player1().name} todas las rondas`],
      [GameState.FINAL_VICTORY_PLAYER2, `Ganó ${this.roomService.player2().name} todas las rondas`],
      [GameState.ABANDONED, 'El otro jugador ha abandonado la partida']
    ])
    return titleMap.get(state) || ''
  })
  protected readonly buttonTitle = computed(() => {
    const state = this.roomService.stateGame()
    const validationVictory = state === GameState.VICTORY_PLAYER1 || state === GameState.VICTORY_PLAYER2
    const validationFinalVictory = state === GameState.FINAL_VICTORY_PLAYER1 || state === GameState.FINAL_VICTORY_PLAYER2
    return validationVictory ? 'Próxima Ronda' : validationFinalVictory ? 'Nueva Partida' : null
  })
  newTurn() {
    this.roomService.requestNewTurn()
  }
}
