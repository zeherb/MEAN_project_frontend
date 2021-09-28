import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class TagsService {
  tagUrl = environment.baseUrl + "/tags";

  constructor(private http: HttpClient) {}
  getAllTags(): Observable<any> {
    return this.http.get<any>(this.tagUrl);
  }
  addTag(body): Observable<any> {
    return this.http.post<any>(this.tagUrl, body);
  }
  deleteTag(id: any): Observable<any> {
    return this.http.delete<any>(this.tagUrl + "/" + id);
  }
  updateTag(id: any, body: any): Observable<any> {
    return this.http.put<any>(this.tagUrl + "/" + id, body);
  }
}
