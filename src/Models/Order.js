const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    items: [{
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
        },
        unit: {
            type: Number
        },
    }],
    totalamount: { type: Number },
    orderDate: { type: Date },
    paidThrough: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String }
}, {
    toJSON: {
        transform: (myobj, ret) => {
            delete ret.__v;
            delete ret.createdAt
            delete ret.updatedAt
        }
    },
    timestamps: true
})


module.exports = mongoose.model('Order', OrderSchema)