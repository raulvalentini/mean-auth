import User from '../../db/models/user';
import AuthConfig from '../../db/models/authConfig';

/**
 * Config base controller
 */
export default class ConfigCtrl {
  model = User;
  authConfigModel = AuthConfig;

  /**
   * Retrieve webapp configuration from environment
   */
  private getEnvWebAppConifg() {
    const _env: any = { 'Dashboards': [] };
    Object.keys(process.env).forEach(key => {
      if (key.indexOf('WEBAPP_') > -1) {
        _env[key.replace('WEBAPP_', '')] = process.env[key];
      }
    });
    return _env;

  }

  /**
   * Return webapp configuration
   */
  getWebAppConfiguration = (req, res, next) => {
    const _env = this.getEnvWebAppConifg();
    res.status(200).json(_env);
  }

}
