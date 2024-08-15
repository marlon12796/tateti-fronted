import { Attribute, Component, EventEmitter, HostAttributeToken, inject, Input, Output } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Output() onClick = new EventEmitter<void>()
  @Input() disabled?: boolean = false
  constructor(
    @Attribute('label') protected readonly label: string,
    @Attribute('type') protected readonly type: 'button' | 'link',
    @Attribute('routerLink') protected readonly routerLink?: string
  ) {}
  onButtonPressed() {
    this.onClick.emit()
  }
}
