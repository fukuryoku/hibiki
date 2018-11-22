var express        = require("express"),
    app            = express(),
    session        = require('express-session'),
    nodemailer     = require('nodemailer'),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    path           = require('path'),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    helmet         = require('helmet'),
    bcrypt         = require('bcrypt-nodejs'),
    async          = require('async'),
    crypto         = require('crypto'),
    User           = require("./models/user"),
    Product        = require("./models/product"),
    Order          = require("./models/order");
    
 

    
    
    var authRoutes     = require("./routes/auth"),
    adminRoutes         = require("./routes/admin"),
    productsRoutes      = require("./routes/products")
    
    
// var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v10";
// mongoose.connect(url);    

// process.env.databseURL;
// mongoose.connect("mongodb://localhost/hibiki");
mongoose.connect("mongodb://hibikiadmin:hibiki313@ds159188.mlab.com:59188/hibiki");




app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());

// app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
// app.engine('.html', require('ejs').__express);
// app.set('view engine', 'html');
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Why frog jump?!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   res.locals.currentUser = req.user;
   next();
});


app.post('/order', function (req, res) {
    

    var smtpTransport = nodemailer.createTransport({
       service: "Gmail", 
       auth: {
       user: 'Hibiki.Tea.Store@gmail.com',
       pass: 'hb_FLY_100%'
       }});

    var maillist = [
      'Hibiki.Tea.Store@gmail.com',
       req.body.email
    ];


   smtpTransport.sendMail({  //email options
   from: "Sender Name <Hibiki.Tea.Store@gmail.com>",
   to: maillist, 
   subject: "Заказ из чайной hibiki store", // subject
   html: `<html><body style="color: #333;"><h1>Ваш аказ в чайной hibiki</h1> Ваш заказ:<div>${req.body.orderTable}</div> <p>Имя: ${req.body.name}</p> <p>email: ${req.body.email}</p><p>Телефон: ${req.body.phone}</p> <p>Адрес доставки ${req.body.adress}</p></body></html>`
    }, function(error, response){  //callback
         if(error){
           console.log(error);
            req.flash('error', 'OOOps! что-то пошло не так');
           res.redirect("/");
        }else{
           console.log("Messages sent");
            req.flash('success', 'Arigatou! Мы приняли Ваш заказ и скоро свяжемся с Вами '+req.body.email);
           
           res.redirect("/");
       }

   smtpTransport.close(); 
    }); });

app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /admin\n Disallow: /admin/new\nDisallow: /admin/edit\nDisallow: /reset\nDisallow: /forgot\nDisallow: /login\nDisallow: /logout\nDisallow: /register\n");
});

app.use("/admin",adminRoutes);
app.use(authRoutes);
app.use(productsRoutes);


app.get("/*", function(req, res){
  res.send("404"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Hibiki serv!");
});