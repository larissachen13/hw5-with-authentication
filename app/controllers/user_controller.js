import jwt from 'jwt-simple';
import User from '../models/user_model';
import dotenv from 'dotenv';
dotenv.config({ silent: true });


export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send('You must provide email and password');
  }

  User.count({ email: req.body.email }, (err, count) => {
    if (count > 0) {
      return res.status(422).send('User already exists');
    }
    const user = new User();
    user.email = email;
    user.password = password;
    user.save()
      .then(result => {
        res.json({ message: 'Post created!' });
      })
      .catch(error => {
        res.json({ error });
      });
    return res.send({ token: tokenForUser(user) });
  }
);
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.API_SECRET);
}
