import { effect, Injectable, signal } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class UserService {
	private readonly name = signal<string>("");
	constructor() {
		const nameStorage = localStorage.getItem("nombre") ?? "";
		if (nameStorage) this.name.set(nameStorage);
	}
	// saveNameLocalStorage(){
	//   effect()
	// }
}
