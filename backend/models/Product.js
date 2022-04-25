const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, unique: true},
        description: {type: String, required: true},
        image: {type: String, required: true},
        categories: {type: Array},
        sizes: {type: Array},
        color: {type: String},
        price: {type: Number, required: true},
    },
    {timestamps: true}
);

module.exports = mongoose.model("Product", productSchema);