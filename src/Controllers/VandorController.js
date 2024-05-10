const { Vandor, Food, Order, Offer } = require("../Models");
const { encryptPass, getToken } = require("../utilities/authUtility");
const jwt = require('jsonwebtoken')

class VandorController {
    static async LoginVandor(req, res, next) {
        try {
            const { email, password } = req.body;
            const vandor = await Vandor.findOne({ email: email });

            if (!vandor) {
                const error = new Error("Vandor not Found")
                error.status = 404;
                throw error;
            }

            const hashedpass = await encryptPass(password, vandor.salt);
            if (hashedpass !== vandor.password) {
                const error = new Error("Invalid Password")
                error.status = 404;
                throw error;
            }
            const payload = {
                email: vandor.email,
                name: vandor.name,
                ownerName: vandor.ownerName,
                id: vandor._id,
            }

            const token = getToken(payload)
            return res.status(200).json(token)

        }
        catch (error) {
            next(error)
        }
    }

    static async getProfile(req, res, next) {
        try {
            const id = req.user.id;
            const vandor = await Vandor.findById(id)
            return res.status(200).json(vandor)
        } catch (error) {
            next(error);
        }
    }

    static async updateProfile(req, res, next) {
        try {
            const { name, ownerName, address } = req.body;
            const id = req.user.id;
            const vandor = await Vandor.findById(id);
            vandor.name = name;
            vandor.ownerName = ownerName;
            vandor.address = address;
            await vandor.save()
            return res.status(201).json({ message: "Updated Succesfully" })
        } catch (error) {
            next(error)
        }
    }


    static async updateService(req, res, next) {
        try {
            const id = req.user.id;
            const vandor = await Vandor.findById(id);
            if (!vandor) {
                const error = new Error("Vandor Not Found");
                error.status = 404;
                throw error;
            }
            vandor.serviceAvailable = !vandor.serviceAvailable;
            await vandor.save()
            return res.status(201).json({ message: "Updated Successfully" })
        } catch (error) {
            next(error)
        }
    }


    static async createFood(req, res, next) {
        try {
            const id = req.user.id;
            const { description, name, foodType, readyTime, price } = req.body;

            const vandor = await Vandor.findById(id);
            if (!vandor) {
                const error = new Error("Vandor Not Found");
                error.status = 404;
                throw error;
            }
            const files = req.files;
            const filenames = files.map((value) => value.filename)
            const food = new Food({ description, name, foodType, readyTime, price, images: filenames, rating: 0, vandorId: id })
            await food.save()
            vandor.food.push(food._id);
            await vandor.save();
            return res.status(201).json({ message: "Food created Succesfully", vandor })
        } catch (error) {
            next(error)
        }
    }


    static async getFood() {
        try {
            const food = await Food.find()
            return res.status(200).json({ message: "Fetched Successfully", food })
        } catch (error) {
            next(error)
        }
    }


    static async addCoverImages(req, res, next) {
        try {
            const id = req.user.id;
            const vandor = await Vandor.findById(id);
            if (!vandor) {
                const error = new Error("Not Vandor Found");
                error.status = 404;
                throw error;
            }
            const files = req.files;
            const filenames = files.map((val) => val.filename)
            console.log(filenames);
            vandor.coverImages.push(...filenames);
            await vandor.save()
            return res.status(201).json({ message: "Images added Successfully", vandor })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }


    static async getOrders(req, res, next) {
        try {
            const vandorId = req.user.id;
            const profile = await Vandor.findById(vandorId);

            if (!profile) {
                const error = new Error("Not authenticated");
                error.status = 200;
                throw error;
            }
            const orders = await Order.find({ vandorId: vandorId });
            return res.status(200).json({ message: "Orders fetched Successfully", orders })

        } catch (error) {
            next(error);
        }
    }


    static async getOrderbyId(req, res, next) {
        try {
            const vandorId = req.user.id;
            const profile = await Vandor.findById(vandorId);
            const { orderId } = req.params;

            if (!profile) {
                const error = new Error("Not authenticated");
                error.status = 200;
                throw error;
            }

            const order = await Order.findById(orderId).where({ vandorId: vandorId }).populate('items.food');

            return res.status(200).json({ message: "Orders fetched Successfully", order });
        } catch (error) {
            next(error);
        }
    }


    static async processOrder(req, res, next) {
        try {
            const { status, remark, readyTime } = req.body;
            const userId = req.user.id;

            const { orderId } = req.params;
            const profile = await Vandor.findById(userId);
            if (!profile) {
                const error = new Error("Not authenticated");
                error.status = 200;
                throw error;
            }

            const order = await Order.findById(orderId).where({ vandorId: userId });
            order.orderStatus = status;
            order.remark = remark;
            order.readyTime = readyTime;
            const updatedOrder = await order.save();
            return res.status(200).json({ message: "Order Changed", updatedOrder });

        } catch (error) {
            next(error);
        }
    }

    static async getOffers(req, res, next) {
        try {
            const user = req.user;
            const vandor = await Vandor.findById(user.id);
            if (!vandor) {
                const error = new Error("Not Authenticated to make this request");
                error.status = 401;
                throw error;
            }

            const offers = await Offer.find({ isActive: true }).populate('vendors');
            if (offers.length > 0) {
                let availableOffers = [];

                offers.map((item) => {
                    if (item.vendors.length > 0) {
                        item.vendors.map((v) => {
                            if (v._id.toString() === vandor._id.toString())
                                availableOffers.push(item);
                        })
                    }

                    if (item.offertype === 'Generic')
                        availableOffers.push(item);
                })

                return res.status(200).json({ message: "Offers fetched Successfully", offers: availableOffers })

            }
            else
                return res.status(200).json({ message: "No offers Available" })
        } catch (error) {
            next(error)
        }
    }

    static async createOffer(req, res, next) {
        try {
            const { title, description, offertype, offerAmount, pincode, promocode, promoType, startValidity, endValidity, bank, bins, minVal, isActive } = req.body;
            const user = req.user;
            const vandor = await Vandor.findById(user.id);
            if (!vandor) {
                const error = new Error("Not Authenticated to make this request");
                error.status = 401;
                throw error;
            }

            const offer = new Offer({ bank, description, bins, isActive, minVal, pincode, promocode, title, vendors: [vandor], offertype, promoType, startValidity, endValidity, offerAmount })
            const result = await offer.save();
            return res.status(201).json({
                message: "Offer Added Successfully !!!",
                offer: result
            })

        } catch (error) {
            next(error);
        }
    }

    static async editOffer(req, res, next) {
        try {
            const { title, description, offertype, offerAmount, pincode, promocode, promoType, startValidity, endValidity, bank, bins, minVal, isActive } = req.body;
            const user = req.user;
            const offerId = req.params.id;

            const vandor = await Vandor.findById(user.id);
            if (!vandor) {
                const error = new Error("Not Authenticated to make this request");
                error.status = 401;
                throw error;
            }

            const offer = await Offer.findById(offerId);
            let flag = false;
            offer.vendors.map(item => {
                if (item.toString() === user.id.toString())
                    flag = true;
            })

            if (!flag) {
                const error = new Error("Not Authenticated to edit this Offer");
                error.status = 401;
                throw error;
            }

            offer.title = title;
            offer.description = description;
            offer.offertype = offertype;
            offer.offerAmount = offerAmount;
            offer.pincode = pincode;
            offer.promocode = promocode;
            offer.promoType = promoType;
            offer.startValidity = startValidity;
            offer.endValidity = endValidity;
            offer.bank = bank;
            offer.bins = bins;
            offer.minVal = minVal;
            offer.isActive = isActive;

            const result = await offer.save();

            return res.status(201).json({
                message: "Offer Updated Successfully !!!",
                offer: result
            })

        } catch (error) {
            next(error);
        }
    }
}

module.exports = VandorController