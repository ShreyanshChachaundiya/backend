const mongoose = require("mongoose");

const schema = mongoose.Schema;

const reviewSchema = new schema({
  name:{type:String, required: true},
  title:{type:String, required: true},
  item: { type: mongoose.Types.ObjectId, ref:"Item", required: true },
  review:{type: String, required: true},
  rating: {type:Number, required:true},
});

module.exports = mongoose.model("Review", reviewSchema);

