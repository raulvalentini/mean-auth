import Logger from '../logger/logger';

/**
 * Server connection credentials configuration
 */
export default function ServerModeConnectConfig() {
  // Init logger
  const logger = Logger.instance;
  // Get server keys
  const serverKey = {};
  const _port = process.env.HTTP_PORT || 3000;
  (<any>serverKey)._port = _port;
  return serverKey;
}
