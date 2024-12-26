import dishData from "../models/dish.js";
import deliveryData from "../models/deliveryOrder.js";
import spotOrderData from "../models/spotOrder.js";
import invoiceData from "../models/invoice.js";
import employeeData from "../models/employee.js";

const userController = {
    getAll: async (req, res) => {
        try {
            const MaCN = req.params.MaCN;
            const result = await dishData.getDish(MaCN);
            res.render('homepage', { dishes: result});
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    getDelivery: async (req, res) => {
        try {
            const MaCN = req.params.MaCN;
            const result = await deliveryData.getPendingByAgency(MaCN);
            const employees = await employeeData.getByAgency(MaCN);
            res.render('deliveryOrder', { orders: result, employees: employees });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    confirmOrder: async (req, res) => {
        try {
            const { MaPTN, MaNV } = req.body;
            await deliveryData.confirmOrder(MaPTN, MaNV);
            res.status(200).json({ status: true});
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    getSpot: async (req, res) => { 
        try {
            const MaCN = req.params.MaCN;
            const result = await spotOrderData.getPendingByAgency(MaCN);
            res.render('spotOrder', { orders: result });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    confirmDelivery: async (req, res) => { 
        try {
            const { MaPTN } = req.body;
            await invoiceData.confirmDelivery(MaPTN);
            res.status(200).json({ status: true});
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    search: async (req, res) => { 
        try {
            const MaCN = req.params.MaCN;
            const { keyword } = req.body;
            const result = await dishData.search(MaCN, keyword);
            res.render('homepage', { dishes: result});
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },
};

export default userController;