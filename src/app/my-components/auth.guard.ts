import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthentificationService } from "../services/authentification.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthentificationService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const loggedIn = this.authService.checkLoggedIn();
    if (!loggedIn) {
      localStorage.removeItem("loginToken");
      this.router.navigate(["/login"]);
    }
    return loggedIn;
  }
}
