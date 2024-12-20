import dishData from "../models/dish.js";
import deliveryData from "../models/delivery.js";

const userController = {
    getAll: async (req, res) => {
        try {
            const MaCN = req.params.MaCN;
            const result = await dishData.getDish(MaCN);
            res.render('homepage', { dishes: result });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    getDelivery: async (req, res) => {
        try {
            const MaCN = req.params.MaCN;
            const result = await deliveryData.getPendingByAgency(MaCN);
            // res.render('delivery');
            res.json(result);
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    confirmDeliver: async (req, res) => {
        try {
            const { MaPTN, MaNV } = req.body;
            await deliveryData.confirm(MaPTN, MaNV);
            res.status(200).json({ status: true});
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    }
};

export default userController;