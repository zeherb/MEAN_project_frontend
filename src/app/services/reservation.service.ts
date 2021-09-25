import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class ReservationService {
  reservationUrl = environment.baseUrl + "/reservation";
  constructor(private http: HttpClient) {}
  reservation(eventId, userId, body?): Observable<any> {
    return this.http.post<any>(
      this.reservationUrl + "/" + userId + "/" + eventId,
      body
    );
  }
}
