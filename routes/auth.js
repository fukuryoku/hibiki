var express    = require("express");
var router     =  express.Router({mergeParams: true});
var  passport  = require("passport");
var async      = require('async');
var crypto     = require('crypto');
var nodemailer = require('nodemailer');
var flash      = require("connect-flash");
var User       = require("../models/user"),
    Product    = require("../models/product");




//  ===========
// AUTH ROUTES
//  ===========

// show register form
router.get("/register", function(req, res){
  res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, email:req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash('error', err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
          req.flash('success', 'Добро пожаловать в клуб  '+user.username);
          res.redirect("/"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/", 
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash('success', 'Вы вышли из своего Аккаунта');
   res.redirect("/");
});


// show FORGOT form
// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          console.log('error, No account with that email');
          req.flash('error', 'Аккаунта с таким email не существует');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'hibiki.tea.store@gmail.com',
          pass: 'hb_FLY_100%'//process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'Hibiki.Tea.Store@gmail.com',
        subject: 'HIBIKI, восстановление пароля',
        text: 'Вы получили это письмо тк Вы пытаетесь восстановить пароль к Вашему аккаунту в магазине чая HIBIKI.\n\n' +
          'Перейдите по ссылке для восстановления пароля:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'Если Вы не продолжите смену пароля, Ваш пароль останется прежним.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'Письмо было отправлено' + user.email + ' с инструкциями восстановления пароля.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Ссылка восстановления пароля устарела');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Ссылка восстановления пароля устарела');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Пароли не совпадают");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'Hibiki.Tea.Store@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'Hibiki.Tea.Store@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Отлично, Ваш пароль изменён!');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});


module.exports = router;