
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from './user.service';
import { User } from '@model';
import { AuthConfig } from '../models/auth-config.model';
import { Subject } from 'rxjs';
import * as _ from 'lodash';


/**
 * App authentication service
 */
@Injectable()
export class AuthService {
  loggedIn = false;
  isAdmin = false;
  redirectUrl: string;
  userId: string;
  isSamlActive: boolean;
  private currentUserSubject = new Subject<User>();
  public currentUser$ = this.currentUserSubject.asObservable();
  private loggedInSubject = new Subject<boolean>();
  public loggedIn$ = this.loggedInSubject.asObservable();

  currentUser: User = new User();

  constructor(private userService: UserService,
              private jwtHelper: JwtHelperService) {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = this.decodeUserFromToken(token);
      this.setCurrentUser(decodedUser);
      this.currentUserChange(decodedUser);
    }
  }

  /**
   * Login user into the application
   * @param emailAndPassword login credentials object
   */
  login(emailAndPassword) {
    return this.userService.login(emailAndPassword).pipe(map(
      res => {
        localStorage.setItem('token', res.token);
        const decodedUser = this.decodeUserFromToken(res.token);
        this.setCurrentUser(decodedUser);
        this.currentUserChange(decodedUser);
        this.loggedInChange();
        return this.loggedIn;
      }
    ));
  }

  /**
   * Logout user from application
   */
  logout() {
    return this.userService.logout().pipe(map(
      res => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('ldapdn');
        sessionStorage.removeItem('ldappwd');
        this.loggedIn = false;
        this.loggedInChange();
        this.isAdmin = false;
        this.currentUser = new User();
      }
    ));
  }

  /**
   * Force user logout
   */
  forceLayoutLogout() {
    localStorage.removeItem('token');
    this.loggedIn = false;
    this.loggedInChange();
    this.isAdmin = false;
    this.currentUser = new User();
  }

  /**
   * Decode user from JWT token
   * @param token JWT token
   */
  decodeUserFromToken(token) {
    return this.jwtHelper.decodeToken(token).user;
  }

  /**
   * Set current user based on information decoded from token
   * @param decodedUser user object decoded from token
   */
  setCurrentUser(decodedUser) {
    this.loggedIn = true;
    this.loggedInChange();
    this.currentUser._id = decodedUser._id;
    this.currentUser.username = decodedUser.username;
    this.currentUser.firstname = decodedUser.firstname;
    this.currentUser.lastname = decodedUser.lastname;
    this.currentUser.email = decodedUser.email;
    this.currentUser.role = decodedUser.role;
    this.currentUser.confirmed = decodedUser.confirmed;
    this.currentUser.imgProfile = decodedUser.imgProfile;
    this.currentUser.authMode = decodedUser.authMode;
    decodedUser.type === '0' ? this.isAdmin = true : this.isAdmin = false;
    delete decodedUser.role;
  }

  /**
   * Check whether user is confirmed
   */
  isConfirmed() {
    return this.currentUser.confirmed;
  }

  /**
   * Change current user subject on user change
   * @param user user object
   */
  currentUserChange(user) {
    this.currentUserSubject.next(user);
  }

  /**
   * Cheange logged in subject on user logged in state change
   */
  loggedInChange() {
    this.loggedInSubject.next(this.loggedIn);
  }
}
