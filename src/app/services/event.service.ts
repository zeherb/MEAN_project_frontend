import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class EventService {
  eventUrl = environment.baseUrl + "/events";
  FullEventsUrl = environment.baseUrl + "/fullEvents";
  oneFullEventUrl = environment.baseUrl + "/fullEvent";

  constructor(private http: HttpClient) {}
  addNewEvent(conectedUserId, body): Observable<any> {
    return this.http.post<any>(this.eventUrl + "/" + conectedUserId, body);
  }
  getAllEvents(): Observable<any> {
    return this.http.get<any>(this.FullEventsUrl);
  }
  getEventById(id): Observable<any> {
    return this.http.get<any>(this.oneFullEventUrl + "/" + id);
  }
  updateEvent(id, body): Observable<any> {
    return this.http.put<any>(this.eventUrl + "/" + id, body);
  }
  updateEventImage(id, body): Observable<any> {
    return this.http.put<any>(this.eventUrl + "/image/" + id, body);
  }
  deleteEvent(eventId, ownerId): Observable<any> {
    return this.http.delete<any>(this.eventUrl + "/" + eventId + "/" + ownerId);
  }
}
