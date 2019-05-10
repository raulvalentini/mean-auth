import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ConfigService } from '@services';
import { User } from '@model';

/**
 * Modal showing collection of LDAP users
 */
@Component({
  selector: 'app-modal-ldap-users',
  templateUrl: './modal-ldap-users.component.html',
  styleUrls: ['./modal-ldap-users.component.css']
})

export class ModalLdapUsersComponent implements OnInit {
  @Input() users: any[];

  public page = 1;
  public query: string;

  selectedUser: any;
  mappedUsers: any[] = [];
  searchForm: FormGroup;
  searchInput = new FormControl('');
  searchText: string;
  sortDirection = 1;
  sortParameter = '';

  constructor(
    public activeModal: NgbActiveModal,
    private cfgServ: ConfigService,
    public formBuilder: FormBuilder
  ) {}

  /**
   * Initialization - map users to local user model
   */
  ngOnInit() {
    this.mapUsers();
  }

  /**
   * Map LDAP users to local user model
   */
  mapUsers() {
    const ldap_fullname = this.cfgServ.startupConfig.LDAP_USERFULLNAME || 'cn';
    const ldap_lastname = this.cfgServ.startupConfig.LDAP_LASTNAME || 'sn';
    const ldap_username = this.cfgServ.startupConfig.LDAP_USERNAME || 'uid';
    const ldap_email = this.cfgServ.startupConfig.LDAP_EMAIL || 'mail';

    for ( const user of this.users ) {
      const userToMap = new User();
      let userFullName = '';
      let userFirstName = '';
      for ( const attr of user.attributes ) {
        switch ( attr.type ) {
          case ldap_fullname:
            userFullName = attr.vals[0];
            break;
          case ldap_lastname:
            userToMap.lastname = attr.vals[0];
            break;
          case ldap_username:
            userToMap.username = attr.vals[0];
            break;
          case ldap_email:
            userToMap.email = attr.vals[0];
            break;
        }
      }
      if ( userFullName && userToMap.lastname ) {
        userFirstName = userFullName.replace(userToMap.lastname, '').trim();
        userToMap.firstname = userFirstName;
      }
      userToMap.authMode = '1';
      this.mappedUsers.push(userToMap);
    }
  }

  /**
   * Sort users by specified parameters
   * @param param sort parameter
   */
  sortUsers(param) {
    this.mappedUsers.sort((a, b) => {
      let propA,
          propB;
      this.sortParameter = param;
      // get properties to sort by, 'zzz' to keep undefined last in the sorting order
      switch (param) {
        case 'firstname':
          propA = a.firstname ? a.firstname.toLowerCase() : 'zzz';
          propB = b.firstname ? b.firstname.toLowerCase() : 'zzz';
        break;
        case 'lastname':
          propA = a.lastname ? a.lastname.toLowerCase() : 'zzz';
          propB = b.lastname ? b.lastname.toLowerCase() : 'zzz';
        break;
        case 'username':
          propA = a.username ? a.username.toLowerCase() : 'zzz';
          propB = b.username ? b.username.toLowerCase() : 'zzz';
        break;
        case 'email':
          propA = a.email ? a.email.toLowerCase() : 'zzz';
          propB = b.email ? b.email.toLowerCase() : 'zzz';
        break;
      }
      // sort them
      if (propA < propB) {
          return -1 * (this.sortDirection);
      }
      if (propA > propB) {
          return 1 * (this.sortDirection);
      } else {
        return 0;
      }
    });
    this.sortDirection = -this.sortDirection;
  }

  /**
   * Set the currently selected user
   * @param _user user object
   */
  userSelect(_user: any): void {
    this.selectedUser = _user;
  }

  /**
   * Close modal window dispatching selected user
   */
  closeModal() {
    this.activeModal.close(this.selectedUser);
  }

  /**
   * Dismiss the modal with no output
   */
  dismissModal() {
    this.activeModal.close();
  }

}
