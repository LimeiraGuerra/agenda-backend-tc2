module.exports = app => {
  const user = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Cadastro
  router.post('/register', user.signUp);

  // Login
  router.post('/login', user.login);
  
  app.use('/api/user', router);
};