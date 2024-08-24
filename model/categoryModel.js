const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Ensure 'name' is unique
  slug: { type: String, required: true, unique: true }, // Ensure 'slug' is unique
  description: { type: String, required: true }, // Ensure 'description' is not null
  image: { type: String },
});

const CategoryDB = mongoose.model("Category", categorySchema);

module.exports = CategoryDB;
