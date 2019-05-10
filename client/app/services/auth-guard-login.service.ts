import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

/**
 * Guard service for login page
 */
@Injectable()
export class AuthGuardLogin implements CanActivate {

  private AUTH_PATH = ['signup', 'login'];

  constructor(public auth: AuthService,
              private router: Router) {}

  /**
   * Activate login route if user is not logged in
   * @param route activated route
   */
  canActivate(route: ActivatedRouteSnapshot) {
    if (!this.auth.loggedIn) {
      this.auth.redirectUrl = route.routeConfig.path;
      this.router.navigate(['/login'], { queryParams: route.queryParams });
    } else {
      if (this.AUTH_PATH.indexOf(route.routeConfig.path) > -1) {
        this.router.navigate(['/home'], { queryParams: route.queryParams });
      } else {
        return this.auth.loggedIn;
      }
    }
  }
}
