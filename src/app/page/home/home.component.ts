import { UserService } from "@/app/services/user.service";
import { Component, inject } from "@angular/core";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.scss",
})
export class HomeComponent {
	readonly userService = inject(UserService);
}
