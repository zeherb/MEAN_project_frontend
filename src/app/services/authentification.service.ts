import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthentificationService {
  userUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}
  login(loginForm): Observable<any> {
    return this.http.post<any>(this.userUrl + "/login", loginForm);
  }
  register(registerForm): Observable<any> {
    return this.http.post<any>(this.userUrl + "/register", registerForm);
  }
  checkLoggedIn() {
    const token = localStorage.getItem("loginToken");
    let headers = new HttpHeaders();
    headers.set("Authorization", "Bearer" + token);
    return this.http.get("/verifyToken");
  }
}
