import AuthConfig from '../../../db/models/authConfig';
import BaseCtrl from '../../../shared/controllers/base';
import SamlService from '../services/samlService';

/**
 * Controller to manage initial app configuration
 */
export default class AuthConfigCtrl extends BaseCtrl {
  model = AuthConfig;

  /**
   * SAML config data persistence
   */
  insertSamlConfig = (req, res) => {
    const obj = new this.model(req.body);
    const _saml = SamlService.instance;
    _saml.insertSamlConfig(obj).then(samlRes => {
      res.status((<any>samlRes).code).json((<any>samlRes).resp);
    }, samlErr => {
      res.status((<any>samlErr).code).json((<any>samlErr).resp);
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  /**
   * Check if SAML is activated
   */
  getSamlActive = (req, res) => {
    const _saml = SamlService.instance;
    const samlActive = _saml.samlConfig.samlActive;
    res.status(200).send(samlActive);
  }
}
