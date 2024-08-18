import { Attribute, Component, } from '@angular/core'

@Component({
  selector: 'app-svg-modal',
  standalone: true,
  imports: [],
  templateUrl: './svg-modal.component.html',
  styleUrl: './svg-modal.component.scss'
})
export class SvgModalComponent {
  constructor(@Attribute('type') protected readonly label: 'checkmark' | 'copy') {}
}
