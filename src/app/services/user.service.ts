import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  userUrl = environment.baseUrl + "/users";
  userAvatarUrl = environment.baseUrl + "/users-avatar";

  constructor(private http: HttpClient) {}
  getUsers(): Observable<any> {
    return this.http.get<any>(this.userUrl);
  }
  getUserById(id: any): Observable<any> {
    return this.http.get<any>(this.userUrl + "/" + id);
  }
  updateUser(id: any, body: any): Observable<any> {
    return this.http.put<any>(this.userUrl + "/" + id, body);
  }
  updateUsersAvatar(id: any, body: any): Observable<any> {
    return this.http.put<any>(this.userAvatarUrl + "/" + id, body);
  }
  affectAdminRole(id: any, body?: any): Observable<any> {
    return this.http.put(this.userUrl + "/affectRole/" + id, body);
  }
  desaffectAdminRole(id: any, body?: any): Observable<any> {
    return this.http.put(this.userUrl + "/desaffectRole/" + id, body);
  }
  deleteUser(id: any): Observable<any> {
    return this.http.delete(this.userUrl + "/" + id);
  }
}
