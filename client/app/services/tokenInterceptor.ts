
import { from as observableFrom,  Observable } from 'rxjs';

import { mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';



/**
 * Service exposing token methods
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  /**
   * Handle token interception
   * @param token JWT token
   * @param request request
   * @param next handler
   */
  private handleInterception(token: string, request: HttpRequest<any>, next: HttpHandler) {
    let tokenIsExpired: boolean;

    tokenIsExpired = false;

    if (token) {
      const acceptType = (request.url.indexOf('zip') < 0) ? 'application/json, text/plain' : 'application/xml',
            authToken = 'Bearer ' + token;
      request = request.clone({
        setHeaders: {
          ['Authorization']: authToken,
          ['Accept']: acceptType
        }
      });
    } else {
      request = request.clone({
        setHeaders: {
          ['Accept']: 'application/json, text/plain'
        }
      });
    }
    return next.handle(request);
  }

  /**
   * Intercept request and get token
   * @param request request
   * @param next handler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: any = this.tokenGetter();

    if (token instanceof Promise) {
      return observableFrom(token).pipe(mergeMap((asyncToken: string) => {
        return this.handleInterception(asyncToken, request, next);
      }));
    } else {
      return this.handleInterception(token, request, next);
    }

  }

  /**
   * Retrieve token from browser localstorage
   */
  private tokenGetter() {
    return localStorage.getItem('token');
  }

}
