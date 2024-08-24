import { ButtonComponent } from '@/app/components/button/button.component'
import { RoomService } from '@/app/services/room.service'
import { UserService } from '@/app/services/user.service'
import { Component, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected readonly userService = inject(UserService)
  protected readonly roomService = inject(RoomService)
  protected readonly router = inject(Router)
  async searchPublicRoom() {
    const room = await this.roomService.searchRoomPublic()
    if (!room?.roomId) return this.router.navigate(['play'])
    return this.router.navigate(['play', room.roomId])
  }
}
