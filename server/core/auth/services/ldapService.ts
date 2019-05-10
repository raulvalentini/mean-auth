import * as ldap from 'ldapjs';
import AuthInterface from '../interfaces/authInterface';
/**
 * Manage interactions with third-party LDAP service
 */
export default class LdapService implements AuthInterface {
  private static _instance: LdapService;
  private ldapClient;

  constructor() {
    this.ldapClient = ldap.createClient({
      url: process.env.LDAP_URL
    });
    this.ldapClient.on('error', (err) => console.log(err));
  }

  /**
   * Authenticate against LDAP client
   * @param dn LDAP distinguished name
   * @param pwd LDAP password
   * @param cb callback
   */
  private authDN(dn, pwd, cb) {
    this.ldapClient.bind(dn, pwd, (err) => {
      cb(err);
    });
  }

  /**
   * Login user with her LDAP credentials
   * @param uid user LDAP username
   * @param pwd user LDAP password
   */
  authUser(uid, pwd, user?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const userDN = (process.env.LDAP_USERDN_PREFIX || '') + uid + (process.env.LDAP_USERDC || '');
        this.authDN(userDN, pwd,
          (err) => {
            if (err) {
              reject(err);
            }
            resolve(err);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  private ldapSearch(userDn, userPwd, resolve, reject) {
    this.authDN(userDn, userPwd,
      (err) => {
        if (err) {
          reject({ error: err });
        }

        const suffix = process.env.LDAP_SUFFIX;
        const opts = {
          filter: process.env.LDAP_FILTER,
          scope: process.env.LDAP_SCOPE,
          attributes: JSON.parse(process.env.LDAP_ATTRIBUTES)
        };

        this.ldapClient.search(suffix, opts, (searchErr, searchRes) => {
          const searchList = [];

          if (searchErr) {
            reject({ error: searchErr });
          }

          searchRes.on('searchEntry', (entry) => {
            if (entry.json) {
              searchList.push({ objectName: entry.json.objectName, attributes: entry.json.attributes });
            }
          });

          searchRes.on('error', (onError) => {
            reject({ error: onError });
          });

          searchRes.on('end', (retVal) => {
            resolve(searchList);
          });

        });
      });
  }

  /**
   * Retrieve full LDAP users list
   * @param userDn LDAP distinguished name
   * @param userPwd LDAP password
   */
  getUsers(userDn: string, userPwd: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.ldapClient.on('error', (ldapErr) => {
          reject({ error: ldapErr });
        });
        if (this.ldapClient.connected) {
          this.ldapSearch(userDn, userPwd, resolve, reject);
        } else {
          this.ldapClient.on('connect', () => {
            this.ldapSearch(userDn, userPwd, resolve, reject);
          });
        }
      } catch (e) {
        reject(e);
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
