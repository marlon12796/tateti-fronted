import { type BOARD_POSITION, GameState, PlayerTurn } from '@/app/interfaces/game'
import { RoomService } from '@/app/services/room.service'
import { Component, computed, inject } from '@angular/core'

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  readonly roomService = inject(RoomService)
  readonly boardChunks = computed(() => {
    const chunks = []
    for (let i = 0; i < this.roomService.board().length; i += 3) {
      const row = this.roomService.board().slice(i, i + 3)
      const rowIndex = row.map((cell, idx) => ({
        value: cell,
        id: (i + idx) as BOARD_POSITION
      }))
      chunks.push(rowIndex)
    }
    return chunks
  })

  isMyTurn = computed(() => {
    const isFirstPlayer =
      this.roomService.stateGame() === GameState['TURN_PLAYER1'] && this.roomService.numberPlayer() === PlayerTurn['PLAYER_1']
    const isSecondPlayer =
      this.roomService.stateGame() === GameState['TURN_PLAYER2'] && this.roomService.numberPlayer() === PlayerTurn['PLAYER_2']
    return isFirstPlayer || isSecondPlayer
  })

  play(position: BOARD_POSITION) {
    this.roomService.turnPlayerRoom(position)
  }
}
