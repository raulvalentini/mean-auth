import User from '../../db/models/user';
import AuthFactory from '../auth/factories/authFactory';

/**
 * Passport configuration
 */
export default class PassportConfig {
  private static passportInstance: PassportConfig;
  public passport = require('passport');
  public authFactory: AuthFactory;

  constructor() {
    const that = this;
    that.authFactory = new AuthFactory();
    const LocalStrategy = require('passport-local').Strategy;
    this.passport.serializeUser(function (user, done) {
      done(null, user);
    });

    this.passport.deserializeUser(function (user, done) {
      done(null, user);
    });

    // Setting isAuthenticated method
    this.passport.isAuthenticated = this.isAuthenticated;

    /**
     * Authentication strategy
     * compare typed password and hashed password for local users
     * call appropriate service for LDAP and SAML users
     */
    this.passport.use('local-login', new LocalStrategy(
      function (username, password, done) {
        User.findOne({ username: username }).populate('role').exec((err, user) => {
          if (err) {
            return done(err);
          }
          if (!user || (user.confirmed === false && user.notification_date && user.isExpired())) {
            return done(null, false);
          }
          const authWrapper = that.authFactory.getAuthWrapper(user);
          authWrapper.authUser(username, password, user).then(resp => done(null, user))
            .catch(loginErr => done(null, false));
        });
      }
    ));
  }

  /**
   * Handle auth requests and routes
   */
  private isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('401: Unauthorized');
  }

  /**
   * Return passport instance
   */
  public static get instancePassport() {
    return this.passportInstance ? this.passportInstance.passport : (this.passportInstance = new this()).passport;
  }
}
