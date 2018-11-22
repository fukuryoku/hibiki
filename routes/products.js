var express = require("express");
var router = express.Router({mergeParams: true});

var User        = require("../models/user"),
    Product     = require("../models/product");


//INDEX - SHOW all prods
router.get("/", function(req, res){
    
    // Get all prods from DB
    Product.find({}, function(err, allProducts){
       if(err){
           console.log(err);
       } else {
          res.render("index",{products:allProducts, currentUser:req.user});
       }
    });
});
//CREATE create new prods
router.post("/", isAdmin, function(req, res){
    var title=req.body.title;
    var info=req.body.info;
    var image=req.body.image;
    var price=req.body.price;
    var description=req.body.description;
    
    var newProd={image:image, title:title, info:info, price:price, description:description};
    
    Product.create(newProd, function(err, newlyCreated){
        if(err){
            console.log('err')
        } else{
            res.redirect("/");

        }
    });
});


//NEW form to create new prod route in admin.js  routes



// SHOW - shows more info about one prod
router.get("/:id", function(req, res){
    //find the prod with provided ID
    Product.findById(req.params.id).exec(function(err, foundProduct){
        if(err|| !foundProduct){
            res.send("404");
            console.log(err);
        } else {
            //render show template with that prod
            res.render("show", {product: foundProduct});
        }
    });
});

//=======edit prods===================
router.get("/:id/edit", isAdmin, function(req, res){
        //find the prod with provided ID
    Product.findById(req.params.id).exec( function(err, foundProduct){
        if(err|| !foundProduct){
            res.send("404");
            console.log(err);
        } else {
            res.render("edit", {product: foundProduct});
        }
    });
});



// UPDATE Prod ROUTE
router.put("/:id", isAdmin, function(req, res){
    // find and update the correct prod
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct){
       if(err||!updatedProduct){
           res.redirect("/");
       } else {
           //redirect somewhere(show page)
           res.redirect("/admin");
       }
    });
});

// DESTROY Prod ROUTE
router.delete("/:id", isAdmin, function(req, res){
        //find the prod with provided ID
    Product.findByIdAndRemove(req.params.id).exec( function(err, foundProduct){
        if(err|| !foundProduct){
            res.send("404");
            console.log(err);
        } else {
          res.redirect("/admin");
        }
    });
});


// router.delete("/:id", isAdmin, function(req, res){
//   Product.findByIdAndRemove(req.params.id, function(err){
//       if(err){
//           res.redirect("/");
//       } else {
//           res.redirect("/");
//       }
//   });
// });





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