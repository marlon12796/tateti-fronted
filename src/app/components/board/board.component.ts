import { PlayerTurn } from '@/app/page/play/game.types'
import { RoomService } from '@/app/services/room.service'
import { GameState } from '@/app/services/types/room'
import { Component, computed, inject } from '@angular/core'

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  readonly buttonGrid: [[number, number, number], [number, number, number], [number, number, number]] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ]
  readonly roomService = inject(RoomService)
  isMyTurn = computed(() => {
    const isFirstPlayer =
      this.roomService.stateGame() === GameState['TURN_PLAYER1'] && this.roomService.numberPlayer() === PlayerTurn['PLAYER_1']
    const isSecondPlayer =
      this.roomService.stateGame() === GameState['TURN_PLAYER2'] && this.roomService.numberPlayer() === PlayerTurn['PLAYER_2']
    return isFirstPlayer || isSecondPlayer
  })

  play(position: number) {
    console.log(position)
  }
}
