const AdminModel = require('../models/admin.model.js');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils.js');

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body
  
    try {
      const admin = await AdminModel.login(email, password);
      const token = createToken(admin._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge});
      res.status(200).json({ admin: admin._id})
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
const createToken = (id) => {
return jwt.sign({id}, process.env.TOKEN_SECRET, {
    expiresIn: maxAge
})
};    

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}