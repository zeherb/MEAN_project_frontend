import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
}
