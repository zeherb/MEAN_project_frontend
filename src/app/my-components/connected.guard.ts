import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthentificationService } from "../services/authentification.service";

@Injectable({
  providedIn: "root",
})
export class ConnectedGuard implements CanActivate {
  constructor(private authService: AuthentificationService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return !this.authService.checkNotConnected();
  }
}
