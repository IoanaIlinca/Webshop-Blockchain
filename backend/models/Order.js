const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        products: [
            {
                _id: {
                    type: String
                },
                details: [
                    {
                        size: {
                            type: String
                        },
                        color: {
                            type: String
                        },
                        quantity: {
                            type: Number,
                            default: 1,
                        }
                    }
                    ],
                quantity: {
                    type: Number,
                    default: 1,
                }
            }
        ],
        amount: {type: Number, required: true},
        address: {type: Object, required: true},
        status: {type: String, default: "pending"}
    },
    {timestamps: true}
);

module.exports = mongoose.model("Order", orderSchema);