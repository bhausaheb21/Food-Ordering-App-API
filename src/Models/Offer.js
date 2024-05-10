const { default: mongoose } = require("mongoose");


const offerSchema = new mongoose.Schema({
    offertype: {
        type: String,
        enum: ["Generic", "Vendor"],
        default: "Generic"
    }, // Type : Generic or Vendor
    vendors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vandor'
        }
    ],
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    minVal: {
        type: Number,
        required: true
    },
    offerAmount: {
        type: Number,
        required: true
    },
    startValidity: {
        type: Date,
    },
    endValidity: {
        type: Date,
    },
    promocode: {
        type: String,
        required: true
    },
    promoType: {
        type: String,
        required: true
    },
    bank: [{
        type: String
    }],

    bins: [{
        type: String
    }],
    pincode: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: false
    }
})

module.exports = mongoose.model('Offers', offerSchema);