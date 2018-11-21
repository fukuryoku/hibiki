// SCHEMA//
var mongoose    = require("mongoose")


var orderSchema = new mongoose.Schema({
     orderNum: {type: Number, unique: true, required: true},
});


module.exports = mongoose.model("Order", orderSchema);