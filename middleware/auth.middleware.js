const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model.js");
const AdminModel = require("../models/admin.model.js");

module.exports.checkUser = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        return res.status(401).json({ message : 'You must register to do this' });
      } else {
        console.log(decodedToken)
        if(decodedToken.role != 'User'){
          res.locals.user = null;
          return res.status(401).json({ message : 'You must register to do this' });
        }else{
          let user = await UserModel.findById(decodedToken.id);
          if(user){
            res.locals.user = user;
            next();
          }else{
            return res.status(401).json({ message : 'You must register to do this' });
          }
          
        }
        
       
      }
    });
  }else {
    res.locals.admin = null;
    return res.status(401).json({ message : 'You must be admin to do this' });
  }
};
module.exports.checkAdmin = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.admin = null;
        return res.status(401).json({ message : 'You must be admin to do this' });
      } else {
        console.log(decodedToken)
        if(decodedToken.role != 'Admin'){
          res.locals.admin = null;
          return res.status(401).json({ message : 'You must be admin to do this' });
        }else{
          let admin = await AdminModel.findById(decodedToken.id);
          if(admin){
            res.locals.admin = admin;
            next();
          }else{
            return res.status(401).json({ message : 'You must be admin to do this' });
          }
          
        }
        
       
      }
    });
  }else {
    res.locals.admin = null;
    return res.status(401).json({ message : 'You must be admin to do this' });
  }
};

module.exports.requireAuth = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message : 'You must register to do this' });
      } else {
        if((decodedToken.role != 'Admin') && (decodedToken.role != 'User') ){
          res.locals.admin = null;
          return res.status(401).json({ message : 'You must register to do this' });
        }else{
          res.locals.admin = null;
          next();
        }
    }
    });
  } else {
    return res.status(401).json({ message : 'You must register to do this' });
  }
};
