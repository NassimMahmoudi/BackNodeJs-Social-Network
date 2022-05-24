const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model.js");
const AdminModel = require("../models/admin.model.js");

module.exports.checkUser = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        // res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports.checkAdmin = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.admin = null;
        // res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        let admin = await AdminModel.findById(decodedToken.id);
        res.locals.admin = admin;
        next();
      }
    });
  } else {
    res.locals.admin = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(200).json('no token')
      } else {
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    res.status(200).send('no token')
  }
};
