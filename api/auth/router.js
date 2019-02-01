const express = require("express");
const router = express.Router();
const passport = require('passport');
const passportSetup = require('./passport');

const authController = require("./controller");
const authMiddleware = require('./auth')

router.get("/login" , authMiddleware.authorize, (req, res) => {
  if(req.session.userInfo || req.session) res.json(req.session.userInfo)
  else res.send(" ")
});

router.post("/", (req, res) => {
  authController
    .login(req.body)
    .then(userInfo => {
      req.session.userInfo = userInfo;
      res.send(userInfo)
    })
    .catch(error => res.status(error.status).send(error.err));
});

router.delete("/", (req, res) => {
  req.session.destroy();
  res.send("Logged out");
});

router.get('/fb', passport.authenticate('facebook', {scope: ['email','user_birthday']}));

router.get('/fb/cb', passport.authenticate('facebook'), function(req, res) {
  const { _id, username } = req.user;
  req.session.userInfo = { id: _id, username }
  res.redirect('http://localhost:3000')
});

module.exports = router;
