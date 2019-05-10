import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLdapUsersComponent } from './modal-ldap-users.component';

describe('ModalLdapUsersComponent', () => {
  let component: ModalLdapUsersComponent;
  let fixture: ComponentFixture<ModalLdapUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLdapUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLdapUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
