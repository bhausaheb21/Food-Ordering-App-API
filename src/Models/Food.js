const { default: mongoose } = require("mongoose");


const foodSchema = new mongoose.Schema({
    vandorId: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String },
    foodType: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: Number },
    images: { type: [String] }
}, {
    timestamps: true,
    toJSON: {
       transform :(obj ,ret)=>{
        delete ret._v;
        delete ret.createdAt
        delete ret.updatedAt
       }
    }
})

module.exports = mongoose.model('food',foodSchema)