import { ServerService } from '@/app/services/server.service'
import { UserService } from '@/app/services/user.service'
import { Component, inject, input, InputSignal } from '@angular/core'

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent {
  serverService = inject(ServerService)
  userService = inject(UserService)
  isPrivate = input()
  id = input<string>()
  ngOnInit() {
    if (!this.isPrivate() && !this.id()) this.serverService.createRoom('public')
    if (this.isPrivate() && !this.id()) this.serverService.createRoom('private')
    if (this.id() && typeof this.id() === 'string') this.serverService.joinRoom(this.id() ?? '')

    this.serverService.onPlayerJoined((data) => {
      console.log(data.message)
      console.log(data.room)
    })
  }
}
