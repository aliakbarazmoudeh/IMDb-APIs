const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
const User = require('../models/User');
const { createToken } = require('../utils/jwt');

const register = async (req, res) => {
  req.body.role = (await User.countDocuments) === 0 ? 'admin' : 'user';
  const user = await User.create(req.body);
  createToken(res, user);
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new customError.BadRequestError('please provide email and password');
  }
  const user = await User.findOne({ email: req.body.email });
  if (!(await user.comparePassword(password))) {
    throw new customError.UnauthenticatedError('invalid password');
  }
  createToken(res, user);
};

const logOut = async (req, res) => {
  res.send('logOut');
};

module.exports = { register, logIn, logOut };
