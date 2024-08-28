import { ButtonComponent } from '@/app/components/button/button.component'
import { UserService } from '@/app/services/user.service'
import { animate, AnimationEvent, keyframes, style, transition, trigger } from '@angular/animations'
import { Component, inject, Renderer2, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink, RouterModule } from '@angular/router'

@Component({
  selector: 'app-change-name',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, RouterModule, ButtonComponent],
  templateUrl: './change-name.component.html',
  styleUrl: './change-name.component.scss',
  animations: [
    trigger('wobble', [
      transition('false => true', [
        animate(
          '0.75s',
          keyframes([
            style({ transform: 'translateX(-5%)', offset: 0.1 }),
            style({ transform: 'translateX(5%)', offset: 0.3 }),
            style({ transform: 'translateX(-5%)', offset: 0.5 }),
            style({ transform: 'translateX(5%)', offset: 0.7 }),
            style({ transform: 'translateX(-5%)', offset: 0.9 }),
            style({ transform: 'translateX(0)', offset: 1 })
          ])
        )
      ])
    ])
  ]
})
export class ChangeNameComponent {
  protected readonly userService = inject(UserService)
  protected readonly router = inject(Router)
  protected wobbleField = signal<boolean>(false)
  profileForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)]
    })
  })
  constructor(private renderer: Renderer2) {}
  ngOnInit() {
    this.profileForm.patchValue({
      name: this.userService.name()
    })
    this.profileForm.statusChanges.subscribe((status) => {
      const inputElement = document.getElementById('name')
      if (status === 'VALID' && inputElement) {
        this.renderer.removeClass(inputElement, 'invalid')
      }
    })
  }
  protected changeName() {
    if (this.profileForm.invalid) this.wobbleField.set(true)
    if (!this.profileForm.value.name) return

    this.userService.name.set(this.profileForm.value.name)
    this.router.navigate(['/'])
  }
  protected onWobbleStart(event: AnimationEvent) {
    if (event.fromState !== 'void') this.renderer.addClass(event.element, 'invalid')
  }
}
