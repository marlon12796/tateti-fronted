import { RoomService } from '@/app/services/room.service'
import { Component, inject } from '@angular/core'

@Component({
  selector: 'app-details-game',
  standalone: true,
  imports: [],
  templateUrl: './details-game.component.html',
  styleUrl: './details-game.component.scss'
})
export class DetailsGameComponent {
  roomService = inject(RoomService)
}
