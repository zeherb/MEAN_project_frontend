import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class EventService {
  eventUrl = environment.baseUrl + "/events";

  constructor(private http: HttpClient) {}
  addNewEvent(conectedUserId, body): Observable<any> {
    return this.http.post<any>(this.eventUrl + "/" + conectedUserId, body);
  }
}
