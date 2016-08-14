import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
});


UserSchema.pre('save', function beforeUserSave(next) {
  const user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (!user.isModified('password')) return next();
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      return next();
    });
  });
});

UserSchema.set('toJSON', {
  virtuals: true,
});

// note use of named function rather than arrow notation
//  this arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  console.log(candidatePassword);
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
};

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
