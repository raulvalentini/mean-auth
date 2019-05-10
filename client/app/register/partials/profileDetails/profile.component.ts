import * as _ from 'lodash';
import { debounceTime } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from '@model';
import { UserService } from '@services';
import { CustomMailValidator } from '../../../shared/validators/custom-mail-validator';

/**
 * User Management user profile tab
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnChanges {

  @Input() profileForm: FormGroup;
  @Input() userProfile: User;
  @Input() _editMode: boolean;

  public userTypes = [
    { value: '0', text: 'Admin', label: 'Admnistration users have access to User Workspace, Case Management and Administration section' },
    { value: '1', text: 'Standard', label: 'Regular users have access to User Workspace and Case Management' }];

  public modalInstance: any;
  public isLdapUserCreation = false;
  public isSamlUserCreation = false;
  public firstname = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30)
  ]);
  public lastname = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30)
  ]);
  public email = new FormControl('', Validators.compose([
    Validators.required,
    Validators.maxLength(50),
    CustomMailValidator.email
  ]));
  public username = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30)
  ]);
  public userType = new FormControl('', [
    Validators.required
  ]);
  public password = new FormControl('', [Validators.minLength(8), Validators.pattern('^[a-zA-Z0-9]{4,16}$')]);
  public confirmPass = new FormControl('', [ Validators.minLength(8), Validators.pattern('^[a-zA-Z0-9]{4,16}$')]);

  constructor(
    public userService: UserService
  ) { }

  /**
   * Initialization - init profile form, clear validators if edit mode is active, set initial mail notification value
   */
  ngOnInit() {
    this.profileForm.addControl('password', this.password);
    this.profileForm.addControl('confirmPass', this.confirmPass);
    this.profileForm.addControl('firstname', this.firstname);
    this.profileForm.addControl('lastname', this.lastname);
    this.profileForm.addControl('email', this.email);
    this.profileForm.addControl('username', this.username);
    this.profileForm.addControl('userType', this.userType);

    if ( this._editMode ) {
      this.password.clearValidators();
      this.confirmPass.clearValidators();
      if (this.profileForm.hasError('notSame')) {
        this.profileForm.setErrors(null);
      }
      this.profileForm.controls.userType.setValue(this.userProfile.type);
    } else {
      this.profileForm.controls.userType.setValue('1');
      this.userProfile.type = '1';
      this.profileForm.setValidators(this.checkPasswords);
    }
    // if creating an SAML user set notSame error as false
    this.profileForm.valueChanges.pipe(debounceTime(600)).subscribe(change => {
      if (this.userProfile.authMode === '2' || this.userProfile.authMode === '1') {
        if (this.profileForm.hasError('notSame')) {
          this.profileForm.setErrors(null);
        }
      }
      if ( this._editMode && this.userProfile.type === '0' ) {
        this.profileForm.controls.userType.disable();
      }
    });
    this.userProfile.authMode = '0';
  }

  /**
   * Listen to changes to input userprofile
   * @param changes simplechanges
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['userProfile']) {
      if (!this._editMode && this.userProfile.authMode && this.userProfile.authMode === '1') {
        this.isLdapUserCreation = true;
      } else {
        this.isLdapUserCreation = false;
      }
      if (!this._editMode && this.userProfile.authMode && this.userProfile.authMode === '2') {
        this.isSamlUserCreation = true;
      } else {
        this.isSamlUserCreation = false;
      }
      this.refreshFormControls();
      this.patchFormData();
    }
  }

  /**
   * Enable or disable form inputs according to user authentication mode
   */
  refreshFormControls() {
    if (this.isLdapUserCreation) {
      this.userProfile.firstname ? this.firstname.disable() : this.firstname.enable();
      this.userProfile.lastname ? this.lastname.disable() : this.lastname.enable();
      this.userProfile.username ? this.username.disable() : this.username.enable();
      this.userProfile.email ? this.email.disable() : this.email.enable();
    } else if (this.isSamlUserCreation) {
      this.password.clearValidators();
      this.confirmPass.clearValidators();
      this.firstname.enable();
      this.lastname.enable();
      this.username.enable();
      this.email.enable();
    } else {
      this.firstname.enable();
      this.lastname.enable();
      this.username.enable();
      this.email.enable();
    }
  }

  /**
   * Check equality of password & confirm password if mail notify is not flagged
   * @param group form group
   */
  private checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPass.value;
    return (pass === confirmPass) ? null : { notSame: true };
  }

  /**
   * Enabler or disable password validators ( not needed if editing user )
   * @param mode whether creating a new user
   */
  private activatePwdValidator(mode: boolean) {
    if ((mode === true) || !this.authModeIsLocal()) {
      this.password.clearValidators();
      this.confirmPass.clearValidators();
      this.cleanPwdValues();
    } else {
      this.password.setValidators([Validators.required, Validators.minLength(8)]);
      this.confirmPass.setValidators([Validators.required, Validators.minLength(8)]);
    }
    this.password.updateValueAndValidity();
    this.confirmPass.updateValueAndValidity();
  }
  /**
   * React to changes in authmode by triggering password validation
   */
  private fromCtrlValueChanged() {
    this.profileForm.get('authMode').valueChanges.subscribe(
      (mode: string) => {
        this.activatePwdValidator(this.userProfile.mailNotification);
      });
  }

  /**
   * Clear password and confirm password fields
   */
  private cleanPwdValues() {
    this.profileForm.controls.confirmPass.setValue('');
    this.userProfile.password = '';
  }

  /**
   * Return whether authentication mode is local
   */
  private authModeIsLocal() {
    return Number(this.userProfile.authMode) === 0;
  }

  /**
   * Disable password field
   */
  public disablePwd() {
    return (!this.userProfile.mailNotification) ? null : '';
  }

  /**
   * Set user type on input change
   * @param $event event from usertype radio input
   */
  public userTypeChanged($event) {
    this.userProfile.type = this.profileForm.controls.userType.value;
  }

  public patchFormData() {
    this.profileForm.patchValue({
      firstname: this.userProfile.firstname,
      lastname: this.userProfile.lastname,
      email: this.userProfile.email,
      username: this.userProfile.username,
      imgProfile: this.userProfile.imgProfile,
      type: this.userProfile.type
    });
  }

  public syncFormData() {
    _.merge(this.userProfile, this.profileForm.value);
  }

}
