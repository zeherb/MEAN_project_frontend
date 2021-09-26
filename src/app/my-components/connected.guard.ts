import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthentificationService } from "../services/authentification.service";

@Injectable({
  providedIn: "root",
})
export class ConnectedGuard implements CanActivate {
  constructor(private authService: AuthentificationService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.authService.checkNotConnected();
  }
}
