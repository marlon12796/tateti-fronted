import { UserService } from "@/app/services/user.service";
import { Component, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-change-name",
	standalone: true,
	imports: [RouterLink, ReactiveFormsModule],
	templateUrl: "./change-name.component.html",
	styleUrl: "./change-name.component.scss",
})
export class ChangeNameComponent {
	readonly userService = inject(UserService);
	profileForm = new FormGroup({
		name: new FormControl("", [Validators.required]),
	});
	changeName() {
		if (!this.profileForm.value.name) return;
		this.userService.name.set(this.profileForm.value.name);
	}
}
