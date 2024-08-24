import { RoomService } from '@/app/services/room.service'
import { CommonModule } from '@angular/common'
import { Component, computed, inject } from '@angular/core'

@Component({
  selector: 'app-details-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-game.component.html',
  styleUrl: './details-game.component.scss'
})
export class DetailsGameComponent {
  roomService = inject(RoomService)
  healthPlayer1 = computed(() => Array.from({ length: this.roomService.player1().health }))
  healthPlayer2 = computed(() => Array.from({ length: this.roomService.player2().health }))
}
