import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { NotificationsService } from "./notifications.service";
@Injectable({
  providedIn: "root",
})
export class SocketService {
  socketUrl = environment.baseUrl + "/send-notification";
  notifUrl = environment.baseUrl + "/notifications";

  constructor(private http: HttpClient) {}
  sendNotif(id: any, body: any): Observable<any> {
    const message = { text: body };
    return this.http.post(this.socketUrl + "/" + id, message);
  }
}
