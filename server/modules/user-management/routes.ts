import UserManagementCtrl from './controllers/userManagement';

/**
 * Server route configuration
 * @param app
 * @param passport
 */
export default function setModuleRoutes(_app, _router, _passport) {

  const userMngtCtrl = new UserManagementCtrl();

  // Authenticated routes
    // Single User
  _router.route('/user').post(_passport.isAuthenticated, userMngtCtrl.insertUser);
  _router.route('/user').put(_passport.isAuthenticated, userMngtCtrl.updateUserSettings);
  _router.route('/user/:id').get(_passport.isAuthenticated, userMngtCtrl.get);
  _router.route('/user/:id').put(_passport.isAuthenticated, userMngtCtrl.update);
  _router.route('/user/:id').delete(_passport.isAuthenticated, userMngtCtrl.delete);
    // getUserById
  _router.route('/user/id/:id').get(_passport.isAuthenticated, userMngtCtrl.getUserById);
    // getUserByEmail
  _router.route('/user/email/:email').get(_passport.isAuthenticated, userMngtCtrl.getUserByEmail);
    // Users
  _router.route('/users').get(_passport.isAuthenticated, userMngtCtrl.getAll);
  _router.route('/users/count').get(_passport.isAuthenticated, userMngtCtrl.count);
  // retrieve ldapUsers
  _router.route('/users/ldap').post(_passport.isAuthenticated, userMngtCtrl.ldapUsers);

}
