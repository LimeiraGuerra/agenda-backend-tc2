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
    res.status(400).send({id: 'missing-data', msg: "Insufficient data" });
    return;
  }
  if (!emailChecker.validate(req.body.email)) {
    res.status(400).send({id: 'invalid-email', msg: "Email is invalid" });
    return;
  }

  User.findOne({ email: req.body.email }).then(data => {
    if (data) {
      res.status(400).send({id: 'email-already-in-use', msg: "Email already in use" });
      return;
    }

    const user = new User({
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      password: req.body.password.trim()
    });

    user.save(user).then(data => {
      data.password = undefined;
      res.send({ data, token: generateToken({ id: data.id }) })
    });
  }).catch(err => {
    res.status(500).send({id: 'internal-error', msg: err.message });
  });
}

// Realiza o login (retorna o token)
exports.login = (req, res) => {
  if (!(isNotEmpty(req.body.email) && isNotEmpty(req.body.password))) {
    res.status(400).send({id: 'missing-data', msg: "Insufficient data" });
    return;
  }

  if (!emailChecker.validate(req.body.email)) {
    res.status(400).send({id: 'invalid-email', msg: "Email is invalid" });
    return;
  }

  User.findOne({ email: req.body.email }).then(data => {
    if (!data) {
      res.status(400).send({id: 'user-not-found', msg: "User is not found" });
      return;
    }

    bcrypt.compare(req.body.password, data.password).then(match => {
      if (!match) {
        res.status(400).send({id: 'invalid-password', msg: "Password is invalid" });
        return;
      }

      data.password = undefined;
      res.send({ data, token: generateToken({ id: data.id }) })
    });
  }).catch(err => {
    res.status(500).send({id: 'internal-error', msg: err.message });
  });
}