import * as dotenv from 'dotenv';
dotenv.load({ path: '.env' });

import ServerApp from './core/server';

/**
 * Main application instance initialization
 */
const app = ServerApp.instanceServer;
app.startServer();

export { app };
