import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCompletedComponent } from './completed.component';

describe('ModalCompletedComponent', () => {
  let component: ModalCompletedComponent;
  let fixture: ComponentFixture<ModalCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
