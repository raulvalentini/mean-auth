import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

/**
 * User class
 */
const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: { type: String, unique: true, trim: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String,
  token: String,
  creation_date: { type: Date, default: Date.now },
  notification_date: { type: Date, default: Date.now },
  authMode: String,
  type: String,
});

/** Password hashing before user save action */
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, function (error, hash) {
      if (error) { return next(error); }
      user.password = hash;
      next();
    });
  });
});

/** Password hashing before user update action */
userSchema.pre('findOneAndUpdate', function (next) {
  const upVal = this.getUpdate();
  if (!upVal.password) { return next(); }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err); }
    bcrypt.hash(upVal.password, salt, function (error, hash) {
      if (error) { return next(error); }
      upVal.password = hash;
      next();
    });
  });
});

/** Compare typed password with hash stored in DB */
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
};

/** Omit password when returning user */
userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

/** Check if user is of LDAP type */
userSchema.methods.isLdapAuth = function () {
  return Number(this.authMode) === 1;
};

/** Check if user is of SAML type */
userSchema.methods.isSamlAuth = function () {
  return Number(this.authMode) === 2;
};

const User = mongoose.model('User', userSchema);

export default User;
