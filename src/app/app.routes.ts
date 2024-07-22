import type { Routes } from "@angular/router";
import { HomeComponent } from "./page/home/home.component";
import { PlayComponent } from "./page/play/play.component";
import { ChangeNameComponent } from "./page/change-name/change-name.component";
import { requireNameGuard } from "./guards/require-name.guard";

export const routes: Routes = [
	{ path: "", component: HomeComponent, canActivate: [requireNameGuard] },
	{ path: "play", component: PlayComponent, canActivate: [requireNameGuard] },
	{ path: "change-name", component: ChangeNameComponent },
];
