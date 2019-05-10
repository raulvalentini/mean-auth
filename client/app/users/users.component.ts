import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@model';
import { AuthService, UserService } from '@services';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public users: User[] = [];
  public activeUser: User;
  public activeUserPermissions: Array<any> = [];
  public collpsed: boolean;
  public page = 1;
  public query: string;
  public usersFiltered = [];
  public currentUser: User;
  public noResults = 'For the current filters no results were found.';

  public activeCount = 0;
  public onholdCount = 0;
  public rejectedCount = 0;

  constructor(
    public userService: UserService,
    public router: Router,
    private authService: AuthService,
  ) { }

  /**
   * Initialization - add overflow scroll to HTML body and retrieve users and roles
   */
  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.getUsers();
  }

  /**
   * Retrieve all users from user service
   */
  private getUsers() {
    this.userService.getUsers().subscribe(
      res => {
        this.users = (<any>res);
        this.usersFiltered = this.users;
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(['logout']);
        } else {
          console.log('Error');
        }
      }
    );
  }

  filterCounter(_list) {
    this.activeCount = 0;
    this.rejectedCount = 0;
    this.onholdCount = 0;
    _list.forEach(user => {
      if (user.confirmed === true) {
        this.activeCount++;
        user.status = 'active';
        user.addedClass = 'active-class';
      }
    });
  }

}
