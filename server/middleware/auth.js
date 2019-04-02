const models = require('../models');
const Promise = require('bluebird');

const createNewSession = (req, res, next) => {
  models.Sessions.create()
    .then(data => {
      return models.Sessions.get({
        id: data.insertId,
      });
    })
    .then(data => {
      req.session = { hash: data.hash };
      res.cookie('shortlyid', data.hash);
    })
    .then(() => {
      return next();
    })
    .catch(err => {
      throw err;
    });
};

module.exports.createSession = (req, res, next) => {
  if (req.cookies && Object.keys(req.cookies).length) {
    req.session = { hash: req.cookies.shortlyid };
    models.Sessions.get({
      hash: req.cookies.shortlyid,
    })
      .then(data => {
        if (data && data.userId) {
          req.session['userId'] = data.userId;
          return models.Users.get({
            id: data.userId,
          });
        } else {
          createNewSession(req, res, next);
        }
      })
      .then(userData => {
        if (userData && userData.username) {
          req.session['user'] = { username: userData.username};
          return next();
        }
      })
      .catch(err => {
        throw err;
      });
  } else {
    createNewSession(req, res, next);
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.destroySession = (req, res, next) => {
  models.Sessions.delete({ hash: req.cookies.shortlyid })
    .then(() => {
      res.clearCookie('shortlyid');
      next();
    })
    .catch(err => {
      throw err;
    });
};

module.exports.verifySession = (req, res, next) => {
  // If not verified, redirect to '/login'
  // Else call next()
};