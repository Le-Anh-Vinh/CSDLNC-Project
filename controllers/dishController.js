import dishData from "../models/dish.js";
import MyError from "../cerror.js";

const dishController = {
    updateStatus: async (req, res) => {
        try {
            const { MaMA, MaTD, PhucVu } = req.body;
            const result = await dishData.updateStatus(MaMA, MaTD, PhucVu);
            res.status(200).json({ status: true, result: result });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    getDishStatistics: async (req, res) => {
        try {
            const { MaCN, StartDate, EndDate } = req.body;
            const startDate = new Date(StartDate);
            const endDate = new Date(EndDate);
            const result = await dishData.getStatisticsByAgency(MaCN, startDate, endDate);
            res.status(200).json({ status: true, result: result });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    }
};

export default dishController;