import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpStatusCode, HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, Observable, of, throwError } from "rxjs";
import { ErrorHandlerService } from "../services/error-handler.service";
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class ErrorInterceptor extends ErrorHandlerService implements HttpInterceptor{
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private errorService: ErrorHandlerService
    ){ super()}

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError ((err) => {
            switch(err.status){
                case HttpStatusCode.Unauthorized:
                    this.errorService.displayInvalidParameter(err.error.message);
                    break;
                case HttpStatusCode.Ok:
                    this.errorService.displaySuccesAlert(err.error.text);
                    return of(new HttpResponse({
                        body: err.error
                    }));
                default:
                    this.errorService.displayInvalidParameter(err.error.message);
                    break;
            }

            const error = err.error.message || err.statusText
            return throwError(error);
        }))
    }
}