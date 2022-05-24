const AdminModel = require('../models/admin.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { signUpErrors, signInErrors } = require('../utils/errors.utils.js');
const maxAge = 3 * 24 * 60 * 60 * 1000;

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body
  
    try {
      const admin = await AdminModel.login(email, password);
      let token = jwt.sign({id: admin._id, nom: admin.pseudo, role: admin.role}, process.env.TOKEN_SECRET,{expiresIn:'3h'});
      res.header('x-access-token',token).json({ message : 'Login Success !!!'});
    } catch (err){
     const errors = signInErrors(err);
      res.status(200).json({ errors });
    }
  }
  module.exports.signUp = async (req, res) => {
    const {pseudo, email, password} = req.body
  
    try {
      const admin = await AdminModel.create({pseudo, email, password });
      res.status(201).json({ admin: admin._id});
    }
    catch(err) {
      const errors = signUpErrors(err);
      res.status(200).send({ errors })
    }
  }
 

module.exports.logout = async (req, res) => {
  let token = req.headers['x-access-token'];
  let randomNumberToAppend = toString(Math.floor((Math.random() * 1000) + 1));
  let hashedRandomNumberToAppend = await bcrypt.hash(randomNumberToAppend, 10);
  token = hashedRandomNumberToAppend;  
  res.header('x-access-token',token).json({ message : 'Logout Success !!!'});
}