import spotOrderData from "../models/spotOrder.js";

const spotController = {
    create: async (req, res) => {
        try {
            const { MaCN, SoBan, MaNVTaoPhieu } = req.body;
            const result = await spotOrderData.create(MaCN, SoBan, MaNVTaoPhieu);

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

            for (const item of cartItems) {
                const { dishID, quantity } = item;
                await spotOrderData.addDish(result, dishID, quantity);
            }
            req.session.cart = [];
            res.status(200).json({ status: true, message: "Order created successfully!" });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    addDish: async (req, res) => {
        try {
            const MaPGM = req.params.MaPGM;

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

            for (const item of cartItems) {
                const { dishID, quantity } = item;
                await spotOrderData.addDish(MaPGM, dishID, quantity);
            }
            req.session.cart = [];
            res.status(200).json({ status: true, message: "Dish added successfully!" });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    updateStatus: async (req, res) => { 
        try {
            const MaPGM = req.params.MaPGM;
            await spotOrderData.updateStatus(MaPGM);
            res.status(200).json({ status: true, message: "Order finished!" });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    }
};

export default spotController;