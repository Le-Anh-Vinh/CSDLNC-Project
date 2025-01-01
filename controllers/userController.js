import dishData from "../models/dish.js";
import deliveryData from "../models/deliveryOrder.js";
import spotOrderData from "../models/spotOrder.js";
import invoiceData from "../models/invoice.js";
import employeeData from "../models/employee.js";
import accountData from "../models/account.js";

const userController = {
    getAll: async (req, res) => {
        try {
            if (req.session.role === 'customer') {
                const MaCN = req.session.MaCN;
                const result = await dishData.getDish(MaCN);
                let userInf = await accountData.getAdvancedInfoByID(req.session.user.MaTK);
                if (!userInf) {
                    userInf = {
                        DiemTichLuyHienTai: 0,
                        ThoiDiemThangHang: Infinity,
                    };
                }
                res.render('userpage', { dishes: result, userInf: req.session.user, moreUserInf: userInf });
                return;
            } else {
                const result = await dishData.getDish(req.session.MaCN);
                res.render('staffpage', { dishes: result });
            }
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    getDelivery: async (req, res) => {
        try {
            const MaCN = req.session.MaCN;
            const result = await deliveryData.getPendingByAgency(MaCN);
            
            if (!Array.isArray(result)) {
                result = [result];
            }

            const ordersWithDetails = await Promise.all(result.map(async (order) => {
                const itemsWithDetails = await dishData.getByOnlineOrder(order.MaPTN);
                return {
                    ...order,
                    items: itemsWithDetails
                };
            }));
            const employees = await employeeData.getByAgency(MaCN);
            res.render('staffViewOrders', { Orders: ordersWithDetails, employees: employees });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    confirmOrderOnline: async (req, res) => {
        try {
            const { MaNV, MaPTN } = req.body;
            await deliveryData.confirmOrder(MaPTN, MaNV);
            const orderInfo = await deliveryData.getByID(MaPTN);
            await invoiceData.create(MaPTN, MaNV, orderInfo.MaTKTao);
            res.status(200).json({ status: true});
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    confirmOrderSpot: async (req, res) => { 
        try {
            let { MaPGM, MaTV } = req.body;
            const invoiceID = await spotOrderData.createInvoice(MaPGM, MaTV);
            res.status(200).json({ status: true, invoiceID: invoiceID });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    getSpot: async (req, res) => { 
        try {
            const MaCN = req.session.MaCN;
            const result = await spotOrderData.getPendingByAgency(MaCN);

            if (!Array.isArray(result)) {
                result = [result];
            }

            const ordersWithDetails = await Promise.all(result.map(async (order) => {
                const itemsWithDetails = await dishData.getBySpotOrder(order.MaPGM);
                return {
                    ...order,
                    items: itemsWithDetails
                };
            }));
            res.render('ListOrderTaiQuan', { Orders: ordersWithDetails });
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
            const MaCN = req.session.MaCN;
            const keyword = req.query.keyword;
            const result = await dishData.search(MaCN, keyword);
            if (req.session.role === 'customer') {
                let userInf = await accountData.getAdvancedInfoByID(req.session.user.MaTK);
                if (!userInf) {
                    userInf = {
                        DiemTichLuyHienTai: 0,
                        ThoiDiemThangHang: Infinity,
                    };
                }
                res.render('userpage', { dishes: result, userInf: req.session.user, moreUserInf: userInf });
            } else {
                res.render('staffpage', { dishes: result });
            }
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },
};

export default userController;