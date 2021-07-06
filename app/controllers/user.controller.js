const db = require("../models");
const User = db.user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config.js');
const emailChecker = require("email-validator");

const isNotEmpty = (value) => {
  return value && value.trim().length > 0;
}

function generateToken(params = {}) {
  return jwt.sign({ params }, authConfig.secret, {
    expiresIn: 10286,
  });
}

// Cadastra uma nova conta e já retorna o token
exports.signUp = (req, res) => {
  if (!(isNotEmpty(req.body.name) && isNotEmpty(req.body.email) && isNotEmpty(req.body.password))) {
    res.status(400).send({ msg: "Missing data" });
    return;
  }
  if (!emailChecker.validate(req.body.email)) {
    res.status(400).send({ msg: "Email is invalid" });
    return;
  }

  User.findOne({ email: req.body.email }).then(data => {
    if (data) {
      res.status(400).send({ msg: "Email already in use" });
      return;
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    user.save(user).then(data => {
      data.password = undefined;
      res.send({ data, token: generateToken({ id: data.id }) })
    });
  }).catch(err => {
    res.status(500).send({ msg: err.message });
  });
}

// Realiza o login (retorna o token)
exports.login = (req, res) => {
  if (!(isNotEmpty(req.body.email) && isNotEmpty(req.body.password))) {
    res.status(400).send({ msg: "Missing data" });
    return;
  }

  User.findOne({ email: req.body.email }).then(data => {
    if (!data) {
      res.status(400).send({ msg: "User not found" });
      return;
    }

    bcrypt.compare(req.body.password, data.password).then(match => {
      if (!match) {
        res.status(400).send({ msg: "Invalid email or password" });
        return;
      }

      data.password = undefined;
      res.send({ data, token: generateToken({ id: data.id }) })
    });
  }).catch(err => {
    res.status(500).send({ msg: err.message });
  });
}