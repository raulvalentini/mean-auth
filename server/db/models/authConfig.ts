import * as mongoose from 'mongoose';

/**
 * Class for persistence of initial configuration parameters
 */
const authConfigSchema = new mongoose.Schema({
  samlActive: Boolean,
  samlAppId: String,
  samlSubDomain: String,
  samlTokenUrl: String,
  samlAssertionUrl: String,
  samlSecret: String,
  samlClient: String,
  ldapActive: Boolean
});

const AuthConfig = mongoose.model('AuthConfig', authConfigSchema);

export default AuthConfig;
