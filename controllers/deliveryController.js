import deliveryData from "../models/delivery.js";
import MyError from "../cerror.js";

const deliveryController = {
    add: async (req, res) => {
        try {
            const { dishID, quantity } = req.body;

            if (!req.session.cart) {
                req.session.cart = [];
            }

            const existingItem = req.session.cart.find(item => item.dishID === dishID);
            if (existingItem) {
                existingItem.quantity = quantity;
            } else {
                req.session.cart.push({ dishID, quantity });
            }
            res.status(200).json({ status: true, cart: req.session.cart });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    remove: async (req, res) => {
        try {
            const { dishID } = req.body;
            if (req.session.cart) {
                req.session.cart = req.session.cart.filter(item => item.dishID !== dishID);
            }
            res.status(200).json({ status: true, cart: req.session.cart });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    getCart: async (req, res) => {
        try {
            res.render('UserCart', { cart: req.session.cart });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const { Address, Phone, Note, MaTK, MaCN} = req.body;
            const result = await deliveryData.create(Address, Phone, Note, MaTK, MaCN);
            for (const item of req.session.cart) {
                const { dishID, quantity } = item;
                await deliveryData.addDish(result, dishID, quantity);
            }
            res.status(200).json({ status: true, message: "Delivery created successfully!", deliveryID: result });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    }
};

export default deliveryController;