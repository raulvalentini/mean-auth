import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

import User from '../../../db/models/user';
import LogParameter from '../../logger/models/logParameter';
import BaseCtrl from '../../../shared/controllers/base';
import KpLogger from '../../logger/kpLogger';

/**
 * User controller
 */
export default class AuthCtrl extends BaseCtrl {
  model = User;

  _kpLogger = KpLogger.instance;

  /**
   * Handle database response calling the appropriate logger
   * @param logParams object containing kpLogger parameters
   * @param err error outcome of invoking function
   * @param item successful outcome of invoking function
   */
  private manageDbResp(logParams, err, item) {
    const dbResp = {
      code: 400,
      obj: { message: 'There was an error.' }
    };
    if (err || !item) {
      dbResp.obj.message = ((err && err.errmsg) ? (dbResp.obj.message + ' ' + err.errmsg) : dbResp.obj.message);
      this._kpLogger.error(logParams, ['user']);
    } else {
      dbResp.code = 200;
      dbResp.obj = item;
      this._kpLogger.info(logParams, ['user']);
    }
    return dbResp;
  }

  /**
   * Generate and return token during user login procedure
   * @param res
   * @param user user to log in
   */
  private resLogin(res, user) {
    const logParams = new LogParameter('User Login', user.username);
    const tokenMaxAge = !isNaN(Number(process.env.SERVER_SESSION_MAX_AGE)) ? (Number(process.env.SERVER_SESSION_MAX_AGE) / 1000) : 3600; // in seconds
    const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN, { expiresIn: tokenMaxAge });
    const dbResp = this.manageDbResp(logParams, '', user);
    if (dbResp.code === 200) {
      res.status(dbResp.code).json({ token: token });
    }
  }

  /**
   * Login user
   */
  login = (req, res) => {
    const logParams = new LogParameter('User Confirmation', req.body.username);
    this.model.findOne({ username: req.body.username }).populate('role').exec((err, user) => {
      if (!user) { return res.sendStatus(403); }
      if (user.isLdapAuth() && !user.confirmed) {
        this.model.findOneAndUpdate({ _id: user._id }, { confirmed: true }, { returnNewDocument: true }, (upErr, item) => {
          const dbResp = this.manageDbResp(logParams, upErr, item);
          if (dbResp.code === 200) {
            user.confirmed = true;
            this.resLogin(res, user);
          } else {
            res.status(dbResp.code).json(dbResp.obj);
          }
        });
      } else {
        this.resLogin(res, user);
      }
    });
  }



  /**
   * Create useradmin user if not already present
   */
  insertAdminUser = (req, res) => {
    const that = this;
    const logParams = new LogParameter('Useradmin Creation', 'Initial');

    this.model.findOne({ type: '0' }, (err, user) => {
      if (err) {
        this._kpLogger.error(logParams, ['user']);
        res.status(400).json({ message: 'Error on create Admin User.' });
      } else if (!user) {
        const obj = new this.model(req.body);
        obj.confirmed = true;
        obj.type = 0;
        obj.authMode = 0;
        obj.save((error, item) => {
          const saveResp = this.manageDbResp(logParams, error, item);
          res.status(saveResp.code).json(saveResp.obj);
        });
        // that.getAdminRoleId().then(roleId => {
        //   obj.role = roleId;
        // }).catch(roleErr => console.error(roleErr));

      } else {
        this._kpLogger.error(logParams, ['user']);
        res.status(501).json({ message: 'Admin User exists. You cannot register another one.' });
      }
    });
  }

}
