import { AfterViewChecked, Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '@services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked {
  title = 'clientMean';

  constructor(public auth: AuthService,
    private jwtHelper: JwtHelperService,
    private router: Router) {
    }

    ngAfterViewChecked() {
      const token = localStorage.getItem('token');
      if (token && this.jwtHelper.isTokenExpired(token)) {
        this.auth.forceLayoutLogout();
        this.router.navigate(['/login']);
      }
    }

}
