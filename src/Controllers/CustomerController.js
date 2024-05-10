const { default: mongoose } = require("mongoose");
const { Customer, Food, Order, Offer, Transaction } = require("../Models");
const { getOtp, sendOTP } = require("../utilities/OTPService");
const { getSalt, encryptPass, getToken } = require("../utilities/authUtility");

class CustomerController {
    static async signup(req, res, next) {
        try {
            const { email, phone, password } = req.body;

            const exisitingCustomer = await Customer.findOne({ $or: [{ phone: phone }, { email: email }] })

            if (exisitingCustomer) {
                const error = new Error("Existing Account Associated with Mobile or Phone")
                error.status = 422;
                throw error;
            }
            const salt = await getSalt();
            const hashedpass = await encryptPass(password, salt)
            const { otp, otp_expiry } = getOtp();
            await sendOTP(otp, phone)

            const customer = new Customer({
                email: email,
                phone: phone,
                salt: salt,
                address: "",
                password: hashedpass,
                otp: otp,
                otp_expiry: otp_expiry,
                verified: false,
                firstname: "",
                lastName: "",
                lat: 0,
                lng: 0,
                pincode: 0
            });

            const custome = await customer.save();

            const payload = {
                id: custome._id,
                email: custome.email,
                name: custome.firstname,
                verified: custome.verified
            }

            const token = getToken(payload);
            return res.json({
                message: "SignUp Successful",
                token,
                verified: custome.verified
            })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async verify(req, res, next) {
        try {
            const id = req.user.id;
            const { otp } = req.body;
            const customer = await Customer.findById(id);
            if (parseInt(otp) === parseInt(customer.otp) && new Date() <= customer.otp_expiry) {
                customer.verified = true;
                const finalcustomer = await customer.save();
                const payload = {
                    id: finalcustomer._id,
                    email: finalcustomer.email,
                    name: finalcustomer.firstname,
                    verified: finalcustomer.verified
                }
                const token = getToken(payload);
                return res.status(200).json({
                    message: "Verification Successful",
                    token,
                    verified: finalcustomer.verified
                })
            }
            const error = new Error("Invalid OTP")
            error.status = 422;
            throw error;
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async getotp(req, res, next) {
        try {
            const id = req.user.id;
            const customer = await Customer.findById(id);

            if (!customer) {
                const error = new Error("Invalid Customer")
                error.status = 422;
                throw error;
            }
            const { otp, otp_expiry } = getOtp();
            await sendOTP(otp, customer.phone)
            customer.otp = otp;
            customer.otp_expiry = otp_expiry;
            await customer.save()
            return res.status(200).json({ message: "OTP send Successfully", customer })
        } catch (error) {
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const customer = await Customer.findOne({ email: email });

            if (!customer) {
                const error = new Error("Invalid Email")
                error.status = 422;
                throw error;
            }

            const match = (await encryptPass(password, customer.salt)).toString() === customer.password.toString();
            if (!match) {
                const error = new Error("Invalid Password");
                error.status = 422;
                throw error;
            }

            const payload = {
                id: customer._id,
                email: customer.email,
                name: customer.firstname,
                verified: customer.verified
            }
            const token = getToken(payload);
            return res.status(200).json({ message: "Login Successful", token, verified: customer.verified })

        } catch (error) {
            next(error)
        }
    }

    static async getCustomerProfile(req, res, next) {
        try {
            const id = req.user.id;

            const profile = await Customer.findById(id);
            if (!profile) {
                const error = new Error("Customer not Found")
                error.status = 404
                throw error;
            }

            return res.status(200).json({ message: "Profile Fetched Successfully", profile })

        } catch (error) {
            next(error)
        }
    }

    static async editCustomerProfile(req, res, next) {
        try {
            const { firstname, lastName, address } = req.body;
            const id = req.user.id;
            const profile = await Customer.findById(id);
            profile.address = address;
            profile.firstname = firstname;
            profile.lastName = lastName;
            const updatedprofile = await profile.save()
            return res.status(201).json({ message: "Updated Sucessfully", updatedprofile });
        } catch (error) {
            // console.log(error);
            next(error)
        }
    }

    //Cart
    static async addtoCart(req, res, next) {
        try {
            const { _id, unit } = req.body;
            console.log(_id);
            const food = await Food.findById(_id)
            console.log(food)
            if (!food) {
                const error = new Error("Invalid Dish Selected")
                error.status = 404;
                throw error;
            }

            const id = req.user.id;
            const profile = await Customer.findById(id);

            if (unit <= 0) {
                const error = new Error("Invalid amount")
                error.status = 422;
                throw error;
            }

            const cartItems = profile.cart;

            let index = cartItems.findIndex((value) => {
                return _id.toString() === value.food.toString();
            })
            console.log(index);
            if (index >= 0) {
                let unit1 = cartItems[index].unit;
                profile.cartPrice -= (unit1 * food.price);
                cartItems[index].unit = unit;
                profile.cartPrice += (unit * food.price)
            }
            else {
                cartItems.push({ food: _id, unit });
                profile.cartPrice += unit * food.price;
            }

            profile.cart = cartItems;

            const updatedProfile = await profile.save();
            return res.status(201).json({ message: "Added to Cart Successfully", cart: updatedProfile.cart, price: updatedProfile.cartPrice })
        } catch (error) {
            next(error)
        }
    }

    static async getCart(req, res, next) {
        try {
            const id = req.user.id;
            const profile = await Customer.findById(id).populate('cart.food');
            console.log(profile.cart);
            if (!profile) {
                const error = new Error("Invalid User");
                error.status = 404;
                throw error;
                // return res.status(200).json({ message: "Cart fetched Successfully", cart: profile.cart });
            }
            return res.status(200).json({ message: "Cart fetched Successfully", cart: profile.cart, cartAmount: profile.cartPrice });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    static async deleteCart(req, res, next) {
        try {
            const id = req.user.id;
            const profile = await Customer.findById(id);
            if (!profile) {
                const error = new Error("Invalid User");
                error.status = 404;
                throw error;
            }
            profile.cart = [];
            profile.cartPrice = 0;
            const { cart } = await profile.save();
            return res.status(200).json({ message: "Cart deleted SUccessfully", cart })
        } catch (error) {
            next(error);
        }
    }
    static async createOrder(req, res, next) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const orderId = `${Math.round(Math.random() * 1000000 + 1000)}`

            const { transactionId } = req.body;
            console.log(transactionId);

            const transaction = await Transaction.findById(transactionId).session(session);

            if (!transaction) {
                const error = new Error("Transaction Required");
                error.status = 402;
                throw error;
            }
            if (transaction.orderId) {
                const error = new Error("Invalid Transaction....");
                error.status = 402;
                throw error;
            }


            const id = req.user.id;
            const profile = await Customer.findById(id).session(session);
            if (!profile) {
                const error = new Error("Customer Invalid");
                error.status = 422;
                throw error;
            }
            const foodItems = []

            const cart = profile.cart;
            if (cart.length == 0) {
                const error = new Error("Cart is Empty.. Please add to Cart");
                error.status = 422;
                throw error;
            }

            cart.map((value) => {
                foodItems.push(value.food);
            })

            const foods = await Food.find().where('_id').in(foodItems).session(session).exec();
            let totalPrice = 0
            let vandorId;
            const cartItems = []
            cart.map((value) => {
                const fod = foods.filter((fd) => fd._id.toString() === value.food.toString());
                console.log(fod);
                vandorId = fod[0].vandorId;
                totalPrice += fod[0].price * value.unit;
                cartItems.push({ food: fod[0], unit: value.unit })
            })

            if (cartItems) {
                const order = new Order({
                    totalamount: totalPrice,
                    orderId,
                    orderDate: new Date(),
                    items: cartItems,
                    transaction: transaction.id,
                    orderStatus: 'Waiting',
                    deleveryId: "",
                    paidamount: transaction.orderValue,
                    vandorId,
                })

                profile.orders.push(order);
                profile.cart = [];
                profile.cartPrice = 0;
                transaction.vendorId = vandorId;
                transaction.status = "CONFIRMED"
                await Promise.all([transaction.save(), profile.save(), order.save()]);
                await session.commitTransaction();
                return res.status(200).json({ message: "Order Placed Successfully", order });
            }
            return res.status(200).json({ message: "No product in cart", })
        } catch (error) {
            await session.abortTransaction()
            console.log(error);
            next(error)
        }
        finally {
            session.endSession()
        }
    }

    static async getOrders(req, res, next) {
        try {
            const id = req.user.id;
            const profile = await Customer.findById(id).populate('orders');
            if (!profile) {
                const error = new Error("Invalid User");
                error.status = 422;
                throw error;
            }

            return res.status(200).json({ message: "Orders Fetched Successfully", orders: profile.orders })

        } catch (error) {
            next(error)
        }
    }

    static async getOrderbyID(req, res, next) {
        try {
            const id = req.user.id;
            const orderId = req.params.orderid;
            const profile = await Customer.findById(id)
            if (!profile) {
                const error = new Error("Customer Invalid");
                error.status = 422;
                throw error;
            }
            const isOrder = profile.orders.filter((value) => {
                return value.toString() === orderId.toString();
            })
            if (isOrder.length > 0) {
                const order = await Order.findById(orderId).populate('items.food');
                return res.status(200).json({ message: "Order Fetched Successfully", order })
            }
            return res.status(401).json({ message: "Unauthorized Access" });
        } catch (error) {
            next(error);
        }
    }


    //Offer Section

    static async verifyOffer(req, res, next) {
        try {
            const id = req.user.id;
            const profile = await Customer.findById(id);

            if (!profile) {
                const error = new Error("Customer Invalid");
                error.status = 422;
                throw error;
            }
            const offerId = req.params.offerId;
            const offer = await Offer.findById(offerId);
            if (offer && offer.isActive) {
                return res.status(200).json({ message: "Verification Successful", offer })
            }
            return res.status(400).json({ message: "Offer is not Valid" })
        } catch (error) {
            next(error)
        }
    }


    static async createPayment(req, res, next) {
        try {
            const id = req.user.id;
            const profile = await Customer.findById(id);
            if (!profile) {
                const error = new Error("Customer Invalid");
                error.status = 422;
                throw error;
            }
            const { paymentMode, offerId } = req.body;
            let payableAmount = profile.cartPrice;
            const transaction = new Transaction({ paymentMode: "COD", paymentResponse: 'Pending', customer: req.user.id, orderValue: payableAmount })
            if (offerId) {
                const offer = await Offer.findById(offerId)
                if (!offer) {
                    const error = new Error("Not a Valid Offer")
                    error.status = 400;
                    throw error;
                }

                if (!offer.isActive) {
                    const error = new Error("Offer is Expired")
                    error.status = 400;
                    throw error;
                }

                if (offer.minVal < profile.cartPrice) {
                    const error = new Error(`Min Order Amount to avail this offer is ${amount}`)
                    error.status = 400;
                    throw error;
                }
                transaction.orderValue -= offer.offerAmount;
                transaction.offerId = offer._id;
            }
            const finaltransaction = await transaction.save();
            return res.status(200).json({ message: "Transaction Successful !!", transaction: finaltransaction })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = CustomerController