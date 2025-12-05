// data/recipes.js
const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    // which user owns this recipe
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    name: String,
    ingredients: String,
    steps: String,
    time: String,
    equipment: String,
    image: String,
    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', RecipeSchema);
