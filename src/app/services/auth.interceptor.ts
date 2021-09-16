import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const loginToken = JSON.parse(localStorage.getItem("loginToken"))?.token;
    request = request.clone({
      setHeaders: {
        authorization: "Bearer" + loginToken,
      },
    });
    return next.handle(request);
  }
}
