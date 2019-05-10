import * as express from 'express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as path from 'path';
import * as _ from 'lodash';

/**
 * Initial wep application settings
 * @param _severKey server key
 * @param _passport passport instance
 */

let sessionParser;

function initialSettings(_severKey, _passport) {

  const app = express();
  app.use(compression());
  app.set('port', (<any>_severKey)._port);
  app.use('/', express.static(path.join(__dirname, '../../../public')));
  app.use(getSessionParser());
  app.use(cookieParser());
  app.use(_passport.initialize());
  app.use(_passport.session());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  return app;
}

function getSessionParser() {
  if (_.isNil(sessionParser)) {
    const sessionMaxAge = !isNaN(Number(process.env.SERVER_SESSION_MAX_AGE)) ? Number(process.env.SERVER_SESSION_MAX_AGE) : 3600000; // in seconds
    sessionParser = session({
      secret: '__y4g4t3S3c43tS3551on__',
      cookie: { maxAge: sessionMaxAge },
      resave: true,
      saveUninitialized: true
    });
  }
  return sessionParser;
}

export { initialSettings, getSessionParser };
