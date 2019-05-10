import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLdapLoginComponent } from './modal-ldap-login.component';

describe('ModalLdapLoginComponent', () => {
  let component: ModalLdapLoginComponent;
  let fixture: ComponentFixture<ModalLdapLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLdapLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLdapLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
