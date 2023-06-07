const mongoose = require("mongoose");

const schema = mongoose.Schema;

const itemSchema = new schema({
  title: { type: String, required: true },
  cost: { type: Number, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["watch", "shirt", "jeans", "mobile", "earphone"],
  },
  reviews: [{ type: mongoose.Types.ObjectId , ref:"Review"}],
});

module.exports = mongoose.model("Item", itemSchema);
