import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, UserService } from '@services';

/**
 * Login component
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoginVisible = true;

  loginForm: FormGroup;
  username = new FormControl('', [
    Validators.required
  ]);
  password = new FormControl('', [
    Validators.required
  ]);

  constructor(private auth: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService) { }

  /**
   * Initialization - navigate to dashboard if user is logged, init login and forgot password forms
   */
  ngOnInit() {
    if (this.auth.loggedIn) {
      this.router.navigate(['/']);
    }
    this.loginForm = this.formBuilder.group({
      username: this.username,
      password: this.password
    });
  }

  /**
   * Set error class for username input
   */
  setClassUsername() {
    return { 'has-danger': !this.username.pristine && !this.username.valid };
  }

  /**
   * Set error class for password input
   */
  setClassPassword() {
    return { 'has-danger': !this.password.pristine && !this.password.valid };
  }

  /**
   * Handle login form submitting
   */
  login() {
    this.auth.login(this.loginForm.value).subscribe(
      res => {
        this.router.navigate(['users']);
      },
      error => console.log('error')
    );
  }
}
