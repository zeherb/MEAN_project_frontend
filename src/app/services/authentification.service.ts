import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import jwtDecode from "jwt-decode";
import { ToasterService } from "angular2-toaster";

@Injectable({
  providedIn: "root",
})
export class AuthentificationService {
  userUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toaster: ToasterService
  ) {}
  login(loginForm): Observable<any> {
    return this.http.post<any>(this.userUrl + "/login", loginForm);
  }
  register(registerForm): Observable<any> {
    return this.http.post<any>(this.userUrl + "/register", registerForm);
  }
  checkLoggedIn(): boolean {
    const token = JSON.parse(localStorage.getItem("loginToken")).token;
    if (token !== null && token !== undefined) {
      return this.checkTokenIsNotExpired(token);
    } else {
      return false;
    }
  }
  checkTokenIsNotExpired(token: string): boolean {
    const decoded: any = jwtDecode(token);
    const currentDate = new Date();
    return decoded.exp >= Math.floor(currentDate.getTime() / 1000);
  }
  checkNotConnected(): boolean {
    if (!localStorage.getItem("loginToken")) {
      return true;
    } else {
      this.router.navigate(["/home"]);
      return false;
    }
  }
  checkAdmin() {
    const token = JSON.parse(localStorage.getItem("loginToken")).token;
    if (token !== null && token !== undefined) {
      const decoded: any = jwtDecode(token);
      const currentDate = new Date();
      const role = decoded.role;
      if (
        decoded.exp >= Math.floor(currentDate.getTime() / 1000) &&
        decoded.role == "admin"
      ) {
        return true;
      } else {
        this.toaster.pop("error", "Error", "NOT AUTHORIZED");
        return false;
      }
    } else {
      return false;
    }
  }
}
