const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validatorjs = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name required'],
  },
  email: {
    type: String,
    required: [true, 'email required'],
    validate: {
      validator: validatorjs.isEmail,
      message: (props) => `${props.value} is not a valid email!`,
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'password must be at least 8 charactor'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const genSalt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, genSalt);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
