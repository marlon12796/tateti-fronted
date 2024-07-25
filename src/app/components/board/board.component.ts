import { Component } from '@angular/core'

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  readonly buttonGrid: [[number, number, number], [number, number, number], [number, number, number]] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ]

  play(position: number) {
    console.log(position)
  }
}
