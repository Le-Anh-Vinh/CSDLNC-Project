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
    
    getOnline: async (req, res) => { 
        try {
            const MaHDGTN = req.params.MaHDGTN;
            const result = await invoiceData.getByID(MaHDGTN);
            console.log(result);
            res.render('check_out_onl', { HoaDonGiaoTanNha: result });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    getAtSpot: async (req, res) => { 
        try {
            const MaHD = req.params.MaHD;
            const result = await invoiceData.getSpotInvoice(MaHD);
            res.render('check_out', { HoaDon: result });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    paymentConfirm: async (req, res) => { 
        try {
            const { MaHD } = req.body;
            await invoiceData.updateSpotStatus(MaHD);
            res.status(200).json({ status: true});
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    customerInvoices: async (req, res) => {
        try {
            const MaTK = req.session.user.MaTK;
            const result = await invoiceData.getByCustomer(MaTK);
            const sortedOrders = result.sort((a, b) => {
                const dateA = new Date(a.NgayLapPTN).getTime();
                const dateB = new Date(b.NgayLapPTN).getTime();
                return dateB - dateA;
            });
            res.render('DanhSachDanhGia', { orders: sortedOrders });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    }
};

export default invoiceController;