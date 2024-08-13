import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() label!: string
  @Input() type: 'button' | 'link' = 'button'
  @Input() routerLink?: string
  @Input() clickHandler?: () => void
}
