import User from '../../../db/models/user';
import AuthConfig from '../../../db/models/authConfig';
import Logger from '../../logger/logger';
import AuthInterface from '../interfaces/authInterface';

/**
 * Service to manage SAML configuration as well as API calls
 */
export default class SamlService implements AuthInterface {

  private static _instance: SamlService;

  private logger = Logger.instance;
  private model = User;
  private authConfigModel = AuthConfig;

  public samlConfig = new AuthConfig();

  constructor() {
    this.getSamlConfig().then(res => {
      this.samlConfig = res;
    }).catch(err => this.logger.error('SAML config not set'));
  }

  /**
   * User authentication procedure
   * @param username user username
   * @param password user password
   */
  authUser = (username, password, user?): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        this.model.findOneAndUpdate({ username: username }, { confirmed: true }, { returnNewDocument: true }, (upErr, item) => {
          if (upErr) {
            reject(upErr);
          }
          // set user as confirmed so she will not need to change password
          item.confirmed = true;
          // make actual SAML login request
          this.samlGetToken(username, password, item).then(token => {
            if (token) {
              this.samlLoginApiCall(token, username, password, item).then(inputUser => {
                resolve(user);
              }, error => reject(error)).catch(err => console.error(err));
            }
          }, error => reject(error)).catch(err => console.error(err));
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Prepare API authentication call by requesting and setting the token
   * @param username user username
   * @param password user password
   * @param user user pbject
   */
  samlGetToken = (username, password, user): Promise<any> => {
    const request = require('request');
    const headerAuthorization = new Buffer(`${this.samlConfig.samlClient}:${this.samlConfig.samlSecret}`).toString('base64');

    const options = {
      method: 'POST',
      uri: this.samlConfig.samlTokenUrl,
      auth: {
        user: this.samlConfig.samlClient,
        pass: this.samlConfig.samlSecret
      },
      headers: {
        'Authorization': 'Basic ' + headerAuthorization,
        'Content-Type': 'application/json'
      },
      json: {
        grant_type: 'client_credentials'
      }
    };
    return new Promise((resolve, reject) => {
      try {
        if (!username || !password) {
          reject(false);
        }
        // request access token and use it to make a call to SAML (onelogin) API
        request(options, function (error, response, body) {
          if (error) {
            reject(error);
          }
          const accessToken = body.access_token;
          resolve(accessToken);
        });
      } catch (e) {
        reject();
      }
    });
  }

  /**
   * SAML authentication API call
   * @param token SAML token received by third party assertion service
   * @param username user username
   * @param password user password
   * @param user user object
   */
  samlLoginApiCall = (token, username, password, user): Promise<any> => {
    const request = require('request');
    const apiUrl = this.samlConfig.samlAssertionUrl;
    const options = {
      method: 'POST',
      uri: apiUrl,
      headers: {
        'Authorization': 'bearer:' + token,
        'Content-Type': 'application/json'
      },
      json: {
        username_or_email: username,
        password: password,
        app_id: this.samlConfig.samlAppId,
        subdomain: this.samlConfig.samlSubDomain
      }
    };
    return new Promise((resolve, reject) => {
      try {
        request(options, function (error, response, body) {
          if (error) {
            reject(error);
          }
          if (body.status.error) {
            reject(body.status.error);
          }
          // response is successful
          resolve(user);
        });
      } catch (e) {
        reject(e);
      }

    });
  }

  /**
   * SAML configuration persistence
   * @param obj SAML config object
   */
  insertSamlConfig = (obj): Promise<any> => {
    const that = this;
    return new Promise((resolve, reject) => {
      try {
        that.getSamlConfig().then(samlRes => {
          // promise successful - there is another config!
          // TODO allow updating instead of rejecting request
          that.editSamlConfig(obj).then(resp => {
            resolve(resp);
          }).catch(err => reject(err));
        }, samlErr => {
          // promise rejected - no config in database so go on
          that.saveSamlConfig(obj).then(resp => {
            resolve(resp);
          }).catch(err => reject(err));
        }).catch(err => reject(err));
      } catch (e) {
        reject(e);
      }
    });

  }

  /**
   * Actual SAML configuration saving into DB
   * @param obj SAML config object
   */
  saveSamlConfig = (obj) => {
    return new Promise((resolve, reject) => {
      try {
        obj.save((err, item) => {
          if (err && err.code === 11000) {
            resolve({ code: 400, resp: err.errmsg });
          }
          if (err === null) {
            this.samlConfig = item;
            resolve({ code: 200, resp: item });
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Update SAML configuration (to be implemented)
   * @param obj SAML config object
   */
  editSamlConfig = (obj) => {
    const editObject = {
      samlActive: obj.samlActive,
      samlAppId: obj.samlAppId,
      samlSecret: obj.samlSecret,
      samlClient: obj.samlClient,
      samlTokenUrl: obj.samlTokenUrl,
      samlAssertionUrl: obj.samlAssertionUrl,
      samlSubDomain: obj.samlSubDomain
    };
    return new Promise((resolve, reject) => {
      try {
        this.authConfigModel.findOneAndUpdate({}, { editObject }, { returnNewDocument: true }, (upErr, item) => {
          if (upErr && upErr.code === 11000) {
            resolve({ code: 400, resp: upErr.errmsg });
          }
          if (upErr === null) {
            this.samlConfig = item;
            resolve({ code: 200, resp: item });
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Retrieve SAML configuration
   */
  getSamlConfig = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        this.authConfigModel.findOne((err, item) => {
          if (err) { reject(err); }
          if (!item) { reject(); }
          resolve(item);
        });
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
