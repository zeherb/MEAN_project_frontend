import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class TicketService {
  ticketUrl = environment.baseUrl + "/tickets";

  constructor(private http: HttpClient) {}
  getAllTickets(): Observable<any> {
    return this.http.get(this.ticketUrl);
  }
  deleteTicket(id: any): Observable<any> {
    return this.http.delete(this.ticketUrl + "/" + id);
  }
}
