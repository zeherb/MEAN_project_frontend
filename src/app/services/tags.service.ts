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
  getAllTags() {
    return this.http.get<any>(this.tagUrl);
  }
  addTag(body) {
    return this.http.post<any>(this.tagUrl, body);
  }
}
