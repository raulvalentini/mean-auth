/**
 * User class
 */
export class User {
  _id?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  creation_date?: string;
  notification_date?: string;
  email?: string;
  roleName?: string;
  role?: Roles;
  confirmed?: boolean;
  authMode?: string;
  mailNotification?: boolean;
  password?: string;
  type?: string;
  imgProfile?: String;
  tokenForgotPwd?: string;
}

/**
 * Permissions class
 */
export class Permissions {
  section?: string;
  moduleName?: string;
  permissions?: Array<any>;
}

/**
 * Profile class
 */
export class Profile {
  name?: string;
  surname?: string;
  username?: string;
}

/**
 * Roles class
 */
export class Roles {
  roleName?: string;
  rolePermissions?: object;
  default?: boolean;
  constructor() {
    this.rolePermissions = new Permissions();
  }
}

/**
 * Authentication mode class
 */
export class Auth {
  authMode?: any;
}

/**
 * User settings class
 */
export class UserSettings {
  profile?: Profile;
  roles?: Roles;
  auth?: Auth;

  constructor() {
    this.profile = new Profile();
    this.roles = new Roles();
    this.auth = new Auth();
  }
}
