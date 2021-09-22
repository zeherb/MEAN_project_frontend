import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const loginToken = JSON.parse(localStorage.getItem("loginToken"))?.token;
    let newRequest;
    if (loginToken !== undefined) {
      newRequest = request.clone({
        setHeaders: {
          authorization: "Bearer " + loginToken,
        },
      });
    } else {
      newRequest = request;
    }

    return next.handle(newRequest).catch((err) => {
      if (err instanceof HttpErrorResponse) {
        console.log(err.status);
        console.log(err.statusText);
        if (err.status === 401) {
          localStorage.removeItem("loginToken");
          this.router.navigate(["/login"]);
        }
      }
      return Observable.throw(err);
    }) as any;
  }
}
