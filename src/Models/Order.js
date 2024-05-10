const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    vandorId: { type: String, required: true },
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
    paidamount : {type : Number},
    orderDate: { type: Date },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },
    orderStatus: { type: String },
    remark: String,
    deleveryId: String,
    readyTime: Number
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