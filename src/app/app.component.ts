import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ButtonsBoxComponent } from './components/buttons-box/buttons-box.component'
import { ServerService } from './services/server.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonsBoxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tateti-fronted'
  serverService = inject(ServerService)
  ngOnInit(): void {
    this.serverService.connect()
  }
}
