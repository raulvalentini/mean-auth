import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

import AuthConfig from '../../../db/models/authConfig';
import LogParameter from '../../../core/logger/models/logParameter';
import LdapService from '../../../core/auth/services/ldapService';
import AuthFactory from '../../../core/auth/factories/authFactory';
import BaseUserCtrl from '../../../shared/controllers/baseUser';

/**
 * User controller
 */
export default class UserManagementCtrl extends BaseUserCtrl {

  authConfigModel = AuthConfig;

  authFactory = new AuthFactory();

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
   * Login user and set its status to confirmed if of LDAP type
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

  // /**
  //  * Retrieve all users
  //  */
  getAll = (req, res) => {
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }

  /**
   * Retrieve a user by ID
   */
  getUserById = (req, res) => {
    this.model.findOne({ _id: req.params.id }).populate('role').exec((err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }

  /**
   * Retrieve a user by its email
   */
  getUserByEmail = (req, res) => {
    this.model.findOne({ email: req.params.email }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }

  /**
   * Update user
   */
  updateUserSettings = (req, res) => {
    const logParams = new LogParameter('Update user settings', req.body.username);
    const updateValues = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email
    };

    this.model.findOneAndUpdate({ email: req.body.email, _id: req.body._id }, updateValues, { returnNewDocument: true }, (err, item) => {
      const dbResp = this.manageDbResp(logParams, err, item);
      res.status(dbResp.code).json(dbResp.obj);
    });
  }

  /**
   * Authenticate against external LDAP service and return list of LDAP users
   */
  ldapUsers = (req, res) => {
    const userDn = req.body.userDn,
      userPwd = req.body.userPwd,
      ldapService = LdapService.instance,
      logParams = new LogParameter('Retrieve LDAP Users', req.body.username);
    req.socket.on('error', (error) => {
      console.error('socket error while retrieveing ldap users');
      res.status(400).json(error);
    });
    // return error if no userdn or user pwd
    if (!userDn || userDn.length === 0 || !userPwd || userPwd.length === 0) {
      this._kpLogger.error(logParams, ['user']);
      res.status(400).json({ error: 'Username o password errati.' });
    }
    ldapService.getUsers(userDn, userPwd).then(
      (resp) => {
        this._kpLogger.info(logParams, ['user']);
        res.status(200).json(resp);
      })
      .catch((err) => {
        this._kpLogger.error(logParams, ['user']);
        res.status(400).json(err);
      });
  }

  /**
   * Insert new user into DB
   */
  insertUser = (req, res) => {
    const obj = new this.model(req.body);
    this.saveUser(obj).then(resp => {
      res.status((<any>resp).code).json((<any>resp).resp);
    }).catch(err => res.status(400).json(err));
  }

  /**
   * Save user
   */
  saveUser = (obj: any, _token?: string) => {
    const logParams = new LogParameter('Save User', obj.username);
    return new Promise((resolve, reject) => {
      try {
        obj.save((err, item) => {
          if (err && err.code === 11000) {
            this._kpLogger.error(logParams, ['user']);
            resolve({ code: 400, resp: err.errmsg });
          }
          this._kpLogger.info(logParams, ['user']);
          resolve({ code: 200, resp: item });
        });
      } catch (e) {
        this._kpLogger.error(logParams, ['user']);
        reject(e);
      }
    });
  }

}
