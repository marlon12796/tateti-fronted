import { inject } from "@angular/core";
import { RedirectCommand, Router, type CanActivateFn } from "@angular/router";
import { UserService } from "../services/user.service";

export const requireNameGuard: CanActivateFn = (route, state) => {
	const userService = inject(UserService);
	const router = inject(Router);
	if (userService.name()) return true;
	const urlTree = router.parseUrl("/change-name");
	return new RedirectCommand(urlTree, { skipLocationChange: true });
};
