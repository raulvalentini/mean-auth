import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Services
import { AuthService, AuthGuardLogin, ConfigService, UserService } from '@services';
import { FilterPipe } from './shared/pipes/filter.pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { UsersComponent } from './users/users.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationComponent } from './register/partials/authentication/authentication.component';
import { ProfileComponent } from './register/partials/profileDetails/profile.component';
import { ModalLdapLoginComponent } from './register/modal/modal-ldap-login/modal-ldap-login.component';
import { ModalLdapUsersComponent } from './register/modal/modal-ldap-users/modal-ldap-users.component';
import { ModalCompletedComponent } from './register/modal/completed/completed.component';


export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    UsersComponent,
    RegisterComponent,
    AuthenticationComponent,
    ProfileComponent,
    ModalLdapLoginComponent,
    ModalLdapUsersComponent,
    ModalCompletedComponent,
    FilterPipe
  ],
  entryComponents: [
    ModalCompletedComponent,
    ModalLdapLoginComponent,
    ModalLdapUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    })
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    ConfigService,
    UserService,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.load(),
      deps: [ConfigService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
