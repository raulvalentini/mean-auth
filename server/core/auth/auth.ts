import * as _ from 'lodash';

import Logger from '../logger/logger';

import setModuleRoutes from './routes';

export default class AuthModule {
  private static _instance: AuthModule;

  private logger;

  constructor() {
    this.logger = Logger.instance;
  }

  public initDbData() {
    this.logger.info('[AuthModules] Init Data on DB');
  }

  public setModuleRoutes(_app, _router, _passport) {
    this.logger.info('[AuthModules] SetRoutes');
    setModuleRoutes(_app, _router, _passport);
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}
