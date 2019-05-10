import * as _ from 'lodash';
import * as path from 'path';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

import Logger from './logger/logger';
import { initAppRoutes, mountAppRouter } from './routes';
import AuthModule from './auth/auth';

export default class BootstrapApplication {
  private static _instance: BootstrapApplication;

  private logger;
  private registerModules;

  constructor() {
    this.logger = Logger.instance;
    this.initRegisterModules();
  }

  private initRegisterModules() {
    const dirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory());

    this.logger.info('[Bootstrap App] Mount default and external modules');
    this.registerModules = [];
    this.registerModules.push(AuthModule.instance);
    this.logger.info('[Bootstrap App] AuthModule default mounted');
    _.each(dirs(path.join(__dirname, '../modules')), mdlDir => {
      const mdl = require('../modules/' + mdlDir);
      this.registerModules.push(mdl.default.instance);
      this.logger.info('[Bootstrap App] Mounted module ' + mdlDir);
    });
  }

  public setRoutes(_app, _passport) {
    this.logger.info('[Bootstrap App] Setting App and Modules Routes');
    // Init Application Routes
    const router = initAppRoutes(_passport);
    // Init Routes for modules
    _.forEach(this.registerModules, (_mdl) => {
      if (_mdl && _mdl.setModuleRoutes) {
        _mdl.setModuleRoutes(_app, router, _passport);
      }
    });
    mountAppRouter(_app, router, _passport);
  }

  public boostrapDBData() {
    this.logger.info('[Bootstrap App] Insert default data in db');
    // Insert modules default data
    _.forEach(this.registerModules, (_mdl) => {
      if (_mdl && _mdl.initDbData) {
        _mdl.initDbData();
      }
    });
  }

  public get RegisterModules() {
    return this.registerModules;
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}
