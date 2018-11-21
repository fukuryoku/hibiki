// SCHEMA//
var mongoose    = require("mongoose")


var productSchema = new mongoose.Schema({
    title: String,
    image: String,
    info: String,
    description: String,
    price: String
});


module.exports = mongoose.model("Product", productSchema);