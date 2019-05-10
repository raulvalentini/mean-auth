/**
 * Manage RSA API interactions
 */
export default class RsaService {
  private static _instance: RsaService;
  private rsaTokenUrl: string;
  private rsaSecret: string;
  private rsaClient: string;

  /**
   * Retrieve token from third-party RSA service
   */
  getToken = (req, res) => {
    const that = this;
    const request = require('request');
    const headerAuthorization = new Buffer(`${this.rsaClient}:${this.rsaSecret}`).toString('base64');

    const options = {
      method: 'POST',
      uri: this.rsaTokenUrl,
      auth: {
        user: this.rsaClient,
        pass: this.rsaSecret
      },
      headers: {
        'Authorization': 'Basic ' + headerAuthorization,
        'Content-Type': 'application/json'
      },
      json: {
        data: ''
      }
    };

    // request access token and use it to make a call to RSA API
    request(options, function (error, response, body) {
      if (error) {
        console.log(error);
        return false;
      }
      const accessToken = body.access_token;
      that.rsaApiCall(accessToken, res);
    });
  }

  /**
   * Call to RSA API
   * @param token third party RSA service token
   * @param res
   */
  rsaApiCall(token, res) { }

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
