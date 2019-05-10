import * as _ from 'lodash';

import Logger from '../../core/logger/logger';
import setModuleRoutes from './routes';

export default class UserManagementModule {
  private static _instance: UserManagementModule;

  private logger;

  constructor() {
    this.logger = Logger.instance;
  }

  public initDbData() {
    this.logger.info('[UserManagementModule] Init Data on DB');
  }

  public setModuleRoutes(_app, _router, _passport) {
    this.logger.info('[UserManagementModule] SetRoutes');
    setModuleRoutes(_app, _router, _passport);
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}
