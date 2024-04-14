const mongoose = require('mongoose')

const VandorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        requires: true
    },
    foodType: {
        type: [String],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    serviceAvailable: {
        type: Boolean,
        required: true
    },
    coverImages: {
        type: [String],
    },
    food: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
        }
    ]
}, {
    timestamps: true,
    toJSON: {
        transform: (obj, ret) => {
            delete ret.__v;
            delete ret.password;
            delete ret.salt;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
})

module.exports = mongoose.model('Vandor', VandorSchema)