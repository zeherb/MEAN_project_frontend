import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class RestePasswordService {
  resetPasswordUrl = environment.baseUrl + "/resetPassword";

  constructor(private http: HttpClient) {}
  resetPasswordWithTken(body: any): Observable<any> {
    return this.http.post<any>(this.resetPasswordUrl, body);
  }
}
