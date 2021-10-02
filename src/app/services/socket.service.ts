import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
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

  saveId(id: any): Observable<any> {
    return this.http.get(environment.baseUrl + "/saveId/" + id);
  }
}
