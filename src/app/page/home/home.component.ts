import { ServerService } from '@/app/services/server.service'
import { UserService } from '@/app/services/user.service'
import { Component, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly userService = inject(UserService)
  readonly serverService = inject(ServerService)
  router = inject(Router)
  async searchPublicRoom() {
    const room = await this.serverService.searchRoomPublic()
    if (!room?.roomId) return this.router.navigate(['play'])
    return this.router.navigate(['play', room])
  }
}
