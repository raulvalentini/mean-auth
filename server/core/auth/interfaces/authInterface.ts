/**
 * Interface to be implemented for user authentication
 */
export default interface AuthInterface {
  /**
   * Authenticate user
   * @param username user username
   * @param password user password
   * @param user user object
   */
  authUser(username: string, password: string, user?: any);
}
