import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { AuthenticationService } from "../services/authentication.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationInterceptor implements HttpInterceptor{

  constructor(private authenticationService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authenticationService.getAcessToken()
    req = req.clone({
      setHeaders:{
        Authorization: `bearer ${accessToken}`
      }
    });
    return next.handle(req)
  }
}
