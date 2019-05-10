import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services';

/**
 * Logout component
 */
@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent implements OnInit {

  constructor(private auth: AuthService,
              private router: Router) { }

  /**
   * Initialization - call logout method of auth service and navigate to root page
   */
  ngOnInit() {
    this.auth.logout().subscribe(
      res => {
        this.router.navigate(['/login']);
      },
      error => console.log(error)
    );
  }

}
