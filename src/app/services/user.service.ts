import { effect, Injectable, signal } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class UserService {
	readonly name = signal<string>(localStorage.getItem("nombre") ?? "");

	saveNameStorage = effect(() => {
		localStorage.setItem("nombre", this.name());
	});
}
