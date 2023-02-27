import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';


@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const expectedRole = route.data['roles'];
    const role = this.authenticationService.getUserRole()
    
    if(this.authenticationService.isAuthenticated()){
        if(role !== expectedRole){
            this.router.navigate(['**'])
            return of(false)
        }
        return of(true)
    }
    
    this.router.navigate(['login'])
    return of(false)
  }
}
