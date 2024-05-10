const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: String,
    phone: {
        type: String,
        required: true
    },
    otp: Number,
    otp_expiry: Date,
    firstname: {
        type: String,
    },
    lastName: {
        type: String,
    },
    address: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    verified: {
        type: Boolean,
        default: false
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    cart: [
        {
            food: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
            },
            unit: {
                type: Number
            }

        }
    ],
    cartPrice: {
        type: Number,
        default: 0
    },
    orders: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
    ]
}, {
    timestamps: true,
    toJSON: {
        transform: (obj, ret) => {
            delete ret.__v;
            delete ret.password;
            delete ret.otp;
            delete ret.otp_expiry;
            delete ret.verified;
            delete ret.salt;
            delete ret.updatedAt
            delete ret.createdAt

        }
    }
})

module.exports = mongoose.model('Customer', customerSchema)