const JWT = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');

const createToken = (res, { _id: userID, name: name, role: role }) => {
  const token = JWT.sign({ userID, name, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  res
    .status(StatusCodes.OK)
    .cookie('token', token, { httpOnly: true, signed: true, secure: true })
    .json({ token });
};

const verifyToken = (token) => JWT.verify(token, process.env.JWT_SECRET);

module.exports = { createToken, verifyToken };
