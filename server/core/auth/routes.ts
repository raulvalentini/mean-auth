import AuthConfigCtrl from './controllers/authConfig';
import AuthCtrl from './controllers/auth';

/**
 * Server route configuration
 * @param app
 * @param passport
 */
export default function setModuleRoutes(_app, _router, _passport) {

  const authConfigCtrl = new AuthConfigCtrl();
  const authCtrl = new AuthCtrl();

  // Config
  _router.route('/authConfig/saml').post(authConfigCtrl.insertSamlConfig);
  _router.route('/authConfig/saml/active').get(authConfigCtrl.getSamlActive);

  _app.post('/api/login', _passport.authenticate('local-login'), authCtrl.login);
  _app.post('/api/logout', function (req, res) {
    (<any>req).logOut();
    res.status(200).json({ resp: 'User Logout success' });
  });
}
