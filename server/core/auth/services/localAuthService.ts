import AuthInterface from '../interfaces/authInterface';

/**
 * Manage authentication for local users
 */
export default class LocalAuthService implements AuthInterface {

  private static _instance: LocalAuthService;

  /**
   * Login user with her credentials
   * @param username user username
   * @param password user password
   * @param user user object
   */
  public authUser(username, password, user): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        user.comparePassword(password, (error, isMatch) => {
          if (!isMatch) {
            reject(false);
          }
          resolve(user);
        });
      } catch ( err ) {
        reject(err);
      }
    });
  }
  /**
   * Return service instance
   */
  public static get instance() {
      if (!this._instance) {
      this._instance = new this();
      }
      return this._instance;
  }
}
