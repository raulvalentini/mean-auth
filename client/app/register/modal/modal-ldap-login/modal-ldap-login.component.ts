import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Modal window to log into external LDAP directory
 */
@Component({
  selector: 'app-modal-ldap-login',
  templateUrl: './modal-ldap-login.component.html',
  styleUrls: ['./modal-ldap-login.component.css']
})

export class ModalLdapLoginComponent implements OnInit {
  public ldapLoginForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder,
  ) {
    this.ldapLoginForm = this.fb.group({
      userDn: new FormControl('', [Validators.required]),
      userPwd: new FormControl('', [Validators.required])
    });
  }

  /**
   * Initialization - empty
   */
  ngOnInit() {
    this.ldapLoginForm.patchValue({
      userDn: 'cn=read-only-admin,dc=example,dc=com',
      userPwd: ''
    });
  }

  /**
   * Close modal window dispatching login data
   */
  public closeModal() {
    this.activeModal.close({
      userDn: this.ldapLoginForm.value.userDn,
      userPwd: this.ldapLoginForm.value.userPwd
    });
  }

  /**
   * Dismiss the modal with no output
   */
  public dismissModal() {
    this.activeModal.close();
  }

}
