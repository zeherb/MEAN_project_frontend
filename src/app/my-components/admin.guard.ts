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
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthentificationService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const adminLoggedIn = this.authService.checkAdmin();
    if (!adminLoggedIn) {
      localStorage.removeItem("loginToken");
      this.router.navigate(["/login"]);
    }
    return adminLoggedIn;
  }
}
