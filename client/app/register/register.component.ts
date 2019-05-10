import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { User } from '@model';
import { AuthService, UserService } from '@services';
import { ModalLdapUsersComponent } from './modal/modal-ldap-users/modal-ldap-users.component';
import { ProfileComponent } from './partials/profileDetails/profile.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild(ProfileComponent) profileCmp: ProfileComponent;

  public editMode = false;
  public buttonLabel: string;
  public userSettings: User;
  public _profileForm: FormGroup;
  public _authForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public userService: UserService,
    public authService: AuthService,
    private router: Router
  ) { }

  /**
   * Initialization - add overflow scroll to HTML body, init forms, get edit mode and user
   */
  ngOnInit() {
    this.initFormsBuilder();
    this.editMode = this.activatedRoute.snapshot.params['edit_mode'] === 'edit_user';
    this.buttonLabel = (this.editMode) ? 'UPDATE PROFILE' : 'CREATE PROFILE';
    this.userSettings = (this.editMode) ? this.userService.getSelectedUser() : new User();
  }

  /**
   * Initialize profile, role and authentication forms
   */
  private initFormsBuilder() {
    this._authForm = this.formBuilder.group({});
    this._profileForm = this.formBuilder.group({});
  }

  /**
   * Create new user then open success modal or show error message in toast
   */
  private createUser() {
    this.userService.register(this.userSettings).subscribe(
      res => {
        this.router.navigate(['/users']);
      },
      error => console.log('error')
    );
  }

  /**
   * Go to users page
   */
  public goToUsersPage() {
    this.router.navigate(['/users_management/users']);
  }

  /**
   * Save user settings by calling appropriate method for creation or update
   */
  public saveUserSettings() {
    this.profileCmp.syncFormData();
    this.createUser();
  }

  /**
   * Retrieve all LDAP users
   * @param $event event object containing LDAP credentials
   */
  public retrieveLdapUsers($event) {
    const _userDn = $event.userDn;
    const _userPwd = $event.userPwd;

    // check if we have login data
    if ( _userDn && _userPwd ) {
      const userData = {
        userDn: _userDn,
        userPwd: _userPwd,
        username: this.userSettings.username
      };
      // retrieve users from ldap directory
      this.userService.getLadpUsers(userData).subscribe(
        res => {
          // keep login data for future requests
          // TODO refactor to set them in server session
          sessionStorage.setItem('ldapdn', _userDn);
          sessionStorage.setItem('ldappwd', _userPwd);

          const usersModal = this.modalService.open(ModalLdapUsersComponent, {size: 'lg' });
          usersModal.componentInstance.users = res;
          usersModal.result.then( (modalRes) => {
            modalRes.type = this.userSettings.type;
            this.updateUserSettingsFromLdap(modalRes);
          }, (err) => {
            console.log(err);
          }).catch(err => console.error(err));
        },
        error => {
          console.log('Error on retrieve users from LDAP repository');
        }
      );
    }
  }
  /**
   * Update user settings with data coming from LDAP directory
   * @param userData user parameters
   */
  updateUserSettingsFromLdap(userData) {
    if ( userData ) {
      this.userSettings = userData;
    }
  }

  /**
   * Listen to changes in authmode and reset user settings if needed
   * @param $event event object containing authmode information
   */
  public onAuthModeChange($event) {
    const authMode = $event;
    const originalType = this.userSettings.type;
    if ( authMode === '0' ) {
      this.userSettings = new User();
      this.userSettings.authMode = '0';
      this.userSettings.type = originalType;
      this.userSettings.mailNotification = false;
    } else if ( authMode === '2' ) {
      this.userSettings = new User();
      this.userSettings.authMode = '2';
      this.userSettings.type = originalType;
      this.userSettings.mailNotification = false;
    }
  }
}
