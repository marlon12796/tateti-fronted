import type { Routes } from "@angular/router";
import { HomeComponent } from "./page/home/home.component";
import { PlayComponent } from "./page/play/play.component";

export const routes: Routes = [
	{ path: "/", component: HomeComponent },
	{ path: "/play", component: PlayComponent },
];
