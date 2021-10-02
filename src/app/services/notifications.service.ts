import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  notifUrl = environment.baseUrl + "/notifications";
  constructor(private http: HttpClient) {}
  getNotifications(id: any): Observable<any> {
    return this.http.get(this.notifUrl + "/" + id);
  }
  seeNotifications(id: any, body?: any): Observable<any> {
    return this.http.put(this.notifUrl + "/" + id, body);
  }
}
