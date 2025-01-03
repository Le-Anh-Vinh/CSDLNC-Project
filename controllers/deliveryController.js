import deliveryData from "../models/deliveryOrder.js";
import agencyData from "../models/agency.js";
import MyError from "../cerror.js";
import dishData from "../models/dish.js";
import spotOrderData from "../models/spotOrder.js";

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
            const { MaCN } = req.body;
            const spotOrders = await spotOrderData.getPendingByAgency(1);
            const orders = spotOrders.map(order => ({
                MaPGM: order.MaPGM,
                SoBan: order.SoBan
            }));
            let totalPrice = 0;
            const cartDetails = [];

            if (req.session.cart) {
                for (const item of req.session.cart) {
                    const dish = await dishData.priceOfDish(item.dishID);
                    const itemTotalPrice = dish.GiaMA * item.quantity;
                    totalPrice += itemTotalPrice;
                    cartDetails.push({
                        dishID: item.dishID,
                        name: dish.TenMA,
                        unitPrice: dish.GiaMA,
                        quantity: item.quantity,
                        totalPrice: itemTotalPrice
                    });
                }
            }
            if (req.session.role === 'customer') {
                res.render('UserCart', { products: cartDetails, totalPrice: totalPrice });
            } else {
                const MaCN = req.session.MaCN;
                const tables = await agencyData.getEmptyTable(MaCN);
                res.render('StaffCart', { products: cartDetails, totalPrice: totalPrice, orders: orders, tables: tables });
            }
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const { Address, Phone, Note, MaTK, MaCN } = req.body;
            let cartItems = [];
            if (req.session.cart) {
                if (Array.isArray(req.session.cart)) {
                    cartItems = req.session.cart;
                } else {
                    cartItems.push(req.session.cart);
                }
            } else {
                res.status(404).json({ status: false, message: "Cart is empty" });
                return;
            }

            const result = await deliveryData.create(Address, Phone, Note, MaTK, MaCN);

            for (const item of cartItems) {
                const { dishID, quantity } = item;
                await deliveryData.addDish(result, dishID, quantity);
            }
            req.session.cart = [];
            res.status(200).json({ status: true, message: "Delivery created successfully!", deliveryID: result });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    get: async (req, res) => { 
        try {
            const { MaTK } = req.body;
            const result = await deliveryData.getByCustomer(MaTK);
            res.render('deliveryOrder', { orders: result });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },
};

export default deliveryController;