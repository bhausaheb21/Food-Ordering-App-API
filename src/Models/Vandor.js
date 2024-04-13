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
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (obj, ret) => {
            delete ret._v;
            delete ret.password;
            delete ret.salt;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
})

module.exports = mongoose.model('Vandor', VandorSchema)