import { UserService } from '@/app/services/user.service'
import { Component, inject } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink, RouterModule } from '@angular/router'

@Component({
  selector: 'app-change-name',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, RouterModule],
  templateUrl: './change-name.component.html',
  styleUrl: './change-name.component.scss'
})
export class ChangeNameComponent {
  readonly userService = inject(UserService)
  readonly router = inject(Router)
  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required])
  })
  changeName() {
    if (!this.profileForm.value.name) return
    this.userService.name.set(this.profileForm.value.name)
    this.router.navigate(['/'])
  }
}
