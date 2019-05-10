import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

/**
 * Modal window showing successful operation outcome
 */
@Component({
  selector: 'app-modal-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css']
})
export class ModalCompletedComponent implements OnInit {

  @Input() editMode: boolean;
  @Input() deleteMode: boolean;
  isAuthentication: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    public router: Router,
  ) { }

  /**
   * Initialization - empty
   */
  ngOnInit() { }

  /**
   * Pinpoint next step according to user service currently active step
   */
  nextStep() {
    this.activeModal.close();
  }

  /**
   * Close modal window and navigate to user managament list
   */
  closeModal() {
    this.activeModal.close();
    this.router.navigate(['/users_management/users']);
  }

}
