var express = require("express");
var router = express.Router({mergeParams: true}),
    passport    = require("passport");

var User        = require("../models/user"),
    Product     = require("../models/product");



router.get("/", isAdmin, function(req, res){
    
    // Get all prods from DB
    Product.find({}, function(err, allProducts){
       if(err){
           console.log(err);
       } else {
          res.render("admin",{products:allProducts, currentUser:req.user});
       }
    });
});
//NEW form to create new prod

router.get("/new", isAdmin, function(req, res){
    res.render("new");
});

function isAdmin (req, res, next) {
 if(req.isAuthenticated())
 {           // is Admin?
            if("5bf678cf324d8e00161819d4"==(req.user._id)) {
                next();
            }
            else {
                res.redirect("back");
            }
}

    else {
        // res.send("please login");
        res.redirect("/login");
    }
}



module.exports = router;