import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthentificationService {
  userUrl = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router) {}
  login(loginForm): Observable<any> {
    return this.http.post<any>(this.userUrl + "/login", loginForm);
  }
  register(registerForm): Observable<any> {
    return this.http.post<any>(this.userUrl + "/register", registerForm);
  }
  checkLoggedIn(): boolean {
    return !!localStorage.getItem("loginToken");
  }
  checkNotConnected(): boolean {
    if (!localStorage.getItem("loginToken")) {
      return true;
    } else {
      this.router.navigate(["/home"]);
      return false;
    }
  }
}
