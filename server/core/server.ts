import * as express from 'express';
import * as path from 'path';
import * as http from 'http';

import { initialSettings } from '../core/settings/initialAppSettings';
import ServerModeConnectConfig from '../core/settings/securityServerControl';
import PassportSettings from '../core/settings/passportSettings';
import logger from './logger/logger';
import dbConnector from '../db/mongoConnector';

import BootstrapApplication from './bootstrap';
/**
 * Main server application class
 */
export default class ServerApp {
  private static serverAppInstance: ServerApp;
  private logger;
  private serverModeConnect;
  private passport;
  private app;
  private db;
  private bootstrapApp;

  constructor() {
    this.logger = logger.instance;
    // http-https-mode
    this.serverModeConnect = ServerModeConnectConfig();
    // passport instance
    this.passport = PassportSettings.instancePassport;
    // basic config (arg, arg2, arg3)
    this.app = initialSettings(this.serverModeConnect, this.passport);
    // Bootstrap App Routines
    this.bootstrapApp = BootstrapApplication.instance;
    // setting db layer
    this.db = dbConnector.getInstance(this.app);
    this.db.connect().then(res => {
      this.bootstrapApp.boostrapDBData();
    }, err => {
      console.log('Return err value ' + JSON.stringify(err));
    });
  }

  /** Start the server */
  public startServer() {
    let server;
    this.bootstrapApp.setRoutes(this.app, this.passport);
    this.app.get('/*', function (req, res) {
      res.sendFile(path.join(__dirname, '../../public/index.html'));
    });
    server = http.createServer(this.app).listen((<any>this.serverModeConnect)._port);
    this.logger.info(`[Server] MEAN AUTH listening on port ${(<any>this.serverModeConnect)._port} in http mode`);
  }

  /** Server app instance */
  public static get instanceServer() {
    return this.serverAppInstance || (this.serverAppInstance = new this());
  }
}
