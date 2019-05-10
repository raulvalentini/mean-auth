import * as _ from 'lodash';

import User from '../../db/models/user';
import LogParameter from '../../core/logger/models/logParameter';
import KpLogger from '../../core/logger/kpLogger';
import BaseCtrl from './base';

/**
 * User controller
 */
export default class BaseUserCtrl extends BaseCtrl {
  model = User;

  protected _kpLogger = KpLogger.instance;

  /**
   * Handle database response calling the appropriate logger
   * @param logParams object containing kpLogger parameters
   * @param err error outcome of invoking function
   * @param item successful outcome of invoking function
   */
  protected manageDbResp(logParams, err, item) {
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
   * Save user and send her a mail notification if needed
   */
  saveUser = (obj: any, _token?: string) => {
    const logParams = new LogParameter('Save User', obj.username);
    return new Promise((resolve, reject) => {
      try {
        obj.save((err, item) => {
          if (err && err.code === 11000) {
            this._kpLogger.error(logParams, ['user']);
            resolve({ code: 400, resp: err.errmsg });
          } else if (err === null) {
            resolve({ code: 200, resp: {} });
            this._kpLogger.info(logParams, ['user']);
          }
        });
      } catch (e) {
        this._kpLogger.error(logParams, ['user']);
        reject(e);
      }
    });
  }

}
