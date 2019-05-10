import * as express from 'express';

import ConfigCtrl from './configs/configCtrl';

/**
 * Server route configuration
 * @param app
 * @param passport
 */
function initAppRoutes(_passport) {

  const router = express.Router();

  const configCtrl = new ConfigCtrl();

  router.route('/webAppConfig').get(configCtrl.getWebAppConfiguration);

  return router;

}

function mountAppRouter(_app, _router, _passport) {
  // Apply the routes to our application with the prefix /api
  _app.use('/api', _router);
}

export { initAppRoutes, mountAppRouter };
