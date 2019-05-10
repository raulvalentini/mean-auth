import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthConfig } from '../models/auth-config.model';
import { User } from '@model';

/**
 * Service exposing user related methods
 */
@Injectable()
export class UserService {

  private selectedUser: User;

  constructor(private http: HttpClient) { }

  /**
   * Retrieve currently selected user or a new one if none is selected
   */
  getSelectedUser() {
    return this.selectedUser || new User();
  }

  /**
   * Set input user object as selected user
   * @param user user object
   */
  setSelectedUser(user: User) {
    this.selectedUser = user;
  }

  /**
   * Create new user
   * @param user user object
   */
  register(user: User): Observable<User> {
    return this.http.post<User>('api/user', user);
  }

  /**
   * Login user according to credentials
   * @param credentials username and password
   */
  login(credentials): Observable<any> {
    return this.http.post('api/login', credentials);
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    return this.http.post('api/logout', {});
  }

  /**
   * Retrieve all users
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('api/users');
  }

  /**
   * Get number of users
   */
  countUsers(): Observable<number> {
    return this.http.get<number>('api/users/count');
  }

  /**
   * Create new user
   * @param user user object
   */
  addUser(user: User): Observable<User> {
    return this.http.post<User>('api/user', user);
  }

  /**
   * Retrieve single user
   * @param user user object
   */
  getUser(user: User): Observable<User> {
    return this.http.get<User>(`api/user/${user._id}`);
  }

  /**
   * Update single user
   * @param user user object
   */
  editUser(user: User): Observable<any> {
    return this.http.put(`api/user/${user._id}`, user, { responseType: 'text' });
  }

  /**
   * Remove user
   * @param user user object
   */
  deleteUser(user: User): Observable<any> {
    return this.http.delete(`api/user/${user._id}`, { responseType: 'text' });
  }

  /**
   * Retrieve user by email
   * @param user user object
   */
  getUserByEmail(user: User): Observable<User> {
    return this.http.get<User>(`api/user/email/${user.email}`);
  }

  /**
   * SAML login request ( currently unused )
   */
  samlLoginRequest(): Observable<any> {
    return this.http.get<any>('api/users/saml/sso/spinitsso-redirect');
  }

  /**
   * Generate onelogin.com token
   */
  oneLoginGenerateToken(): Observable<any> {
    return this.http.post<any>('api/users/saml/sso/token', 'boh');
  }

  /**
   * Login user with SAML credentials
   * @param credentials saml user credentials
   */
  samlLogin(credentials): Observable<any> {
    return this.http.post<any>('api/users/saml/login', credentials);
  }

  /**
   * Save SAML configuration during installation
   * @param config auth config
   */
  saveSamlConfig(config: AuthConfig): Observable<any> {
    return this.http.post<any>('api/authConfig/saml', config);
  }

  /**
   * Check if SAML is active
   */
  getSamlActive(): Observable<any> {
    return this.http.get<any>('api/authConfig/saml/active');
  }

  /**
   * Retrieve LDAP users list
   * @param userData LDAP credentials
   */
  getLadpUsers(userData: any) {
    return this.http.post(`api/users/ldap`, userData);
  }

}
