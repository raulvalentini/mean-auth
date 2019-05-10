import LocalAuthService from '../services/localAuthService';
import LdapService from '../services/ldapService';
import SamlService from '../services/samlService';

/**
 * Factory pointing to the correct auhtentication method according to user authMode
 */
export default class AuthFactory {

  /**
   * Returns appropriate service to authenticate user
   * @param user user object
   */
  getAuthWrapper(user: any) {
    if (user.isLdapAuth()) {
      // ldap user
      return LdapService.instance;
    } else if (user.isSamlAuth()) {
      // saml user
      return SamlService.instance;
    } else {
      // local user
      return LocalAuthService.instance;
    }
  }

}

