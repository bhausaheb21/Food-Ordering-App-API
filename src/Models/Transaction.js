const { default: mongoose } = require("mongoose");


const transactionSchema = new mongoose.Schema({
    customer: String,
    vendorId: String,
    orderId: String,
    orderValue: Number,
    status: String,
    paymentMode: {
        type: String,
        enum: ["COD", "Online"],
        default: "COD"
    },
    paymentResponse: String,
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    }

}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    }
})

module.exports = mongoose.model('Transaction', transactionSchema)