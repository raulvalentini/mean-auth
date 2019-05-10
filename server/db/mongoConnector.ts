import * as morgan from 'morgan';
import * as mongoose from 'mongoose';

import Logger from '../core/logger/logger';

/**
 * Settings for connections to MongoDB
 */
export default class MongoConnector {
  private static instance_mongo: MongoConnector;
  private logger = Logger.instance;
  private mongodbURI;

  constructor(app: any) {
    this.mongodbURI = process.env.NODE_ENV === 'test' ? process.env.MONGODB_TEST_URI : process.env.MONGODB_URI;
    if (this.mongodbURI === process.env.MONGODB_URI && app !== undefined) {
      app.use(morgan('dev'));
    }
  }

  /**
  * Return mongoDB instance
  * @param _app application parameters
  */
  public static getInstance(_app) {
    return this.instance_mongo || (this.instance_mongo = new this(_app));
  }

  public async connect(): Promise<any> {
    return await this.initMongoConnect()
      .then(db => {
        if (db.message) {
          this.logger.info('[MongoConnector] Error Mongo Connect' + db.message);
          this.reconnect();
        } else {
          this.logger.info('[MongoConnector] Connection established with MongoDb');
        }
      })
      .catch(err => this.logger.error(err));
  }

  private reconnect() {
    this.connect();
  }

  /**
   * Initialize database connection
   * @param _mongoInstance mongoDB instance
   */
  private async initMongoConnect(): Promise<any> {
    const that = this;
    try {
      mongoose.connection.on('error', () =>
        that.logger.error(`[MongoConnector] Could not connect with db ${mongoose.connection.name} `)
      );
      mongoose.connection.on('disconnected', () =>
        that.logger.error(`[MongoConnector] Lost with db ${mongoose.connection.name} connection`)
      );
      mongoose.connection.on('connected', () =>
        that.logger.info(`[MongoConnector] Connection established with db ${mongoose.connection.name}`)
      );
      mongoose.connection.on('reconnected', () =>
        that.logger.info(`[MongoConnector] Reconnected with db ${mongoose.connection.name}`)
      );
      return await mongoose.connect(this.mongodbURI,
        {
          auto_reconnect: true,
          useCreateIndex: true,
          useNewUrlParser: true
        });
    } catch (err) {
      this.logger.error(err);
      return err;
    }
  }
}
