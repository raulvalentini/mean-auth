import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalLdapLoginComponent } from '../../modal/modal-ldap-login/modal-ldap-login.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { User } from '@model';

/**
 * User Management user authentication tab
 */
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit, OnChanges {

  @Input() userAuth: User;
  @Input() authenticationForm: FormGroup;

  @Output() ldap = new EventEmitter<any>();
  @Output() authModeChanged = new EventEmitter<any>();

  public authModes = [
    { value: '0', text: 'Local', label: 'Local user authentication (Default value)' },
    { value: '1', text: 'LDAP', label: 'Lightweight Directory Access Protocol (LDAP) user authentication' }];

  public authMode = new FormControl('0', [Validators.required]);

  public modalInstance: any;
  public userAuthMode: string;

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.authenticationForm.addControl('authMode', this.authMode);
  }

  /**
   * Listen to changes in input userauth and saml active
   * @param changes simplechanges
   */
  ngOnChanges(changes: SimpleChanges) {
    if ( changes['userAuth'] ) {
      this.userAuthMode = this.userAuth.authMode;
      if ( this.userAuthMode ) {
        this.authMode.setValue(this.userAuthMode);
      }
    }
  }

  /**
   * Listen to changes in auth mode, bind them to user model and emit them
   * @param $event authmode change event
   */
  public authModeChange($event) {
    this.userAuth.authMode = this.authMode.value;
    this.authModeChanged.emit(this.userAuth.authMode);
  }

  /**
   * Retrieve LDAP users
   */
  public getLdapUsers() {
    // check if login data are already stored, if so emit ldap event
    // TODO refactor after storing them in server session
    if ( (!_.isEmpty(sessionStorage.getItem('ldapdn'))) && (!_.isEmpty(sessionStorage.getItem('ldappwd'))) ) {
      const ldapData = {
        userDn: sessionStorage.getItem('ldapdn'),
        userPwd: sessionStorage.getItem('ldappwd')
      };
      this.ldap.emit(ldapData);
      return;
    }
    // open modal and emit the data sent back
    this.modalInstance = this.modalService.open(ModalLdapLoginComponent, { size: 'lg' });
    this.modalInstance.result.then( (res) => {
      if ( res ) {
        this.ldap.emit(res);
      }
    },
    err => console.log(err)
    ).catch(err => console.error(err));
  }
}
