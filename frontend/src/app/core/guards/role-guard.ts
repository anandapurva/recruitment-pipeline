import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean | UrlTree {

    const expectedRole =
      route.data['role'] as
        | 'recruiter'
        | 'interviewer';


    if (
      this.authService.hasRole( expectedRole )
       ) {
      return true;

    }
    return this.router.createUrlTree(['/unauthorized']);
  }

}