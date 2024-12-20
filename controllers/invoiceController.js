import invoiceData from "../models/invoice.js";

const invoiceController = {
    create: async (req, res) => {
        try {
            const { MaPTN, MaNV, MaTK } = req.body;
            const result = await invoiceData.create(MaPTN, MaNV, MaTK);
            res.status(200).json({ status: true, result: result });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },
    
    get: async (req, res) => { 
        try {
            const MaHDGTN = req.params.MaHDGTN;
            const result = await invoiceData.getByID(MaHDGTN);
            res.json(result);
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    }
};

export default invoiceController;