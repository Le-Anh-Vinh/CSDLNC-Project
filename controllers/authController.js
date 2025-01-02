import accountData from "../models/account.js";
import agencyData from "../models/agency.js";
import MyError from "../cerror.js";
import dishData from "../models/dish.js";

const authController = {
    getAuth: async (req, res) => {
        try {
            const agencyList = await agencyData.getAll();
            res.render('authentication', { agency: agencyList });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password, branch } = req.body;
            const user = await accountData.login(username, password);
            const userInf = await accountData.getByID(user.MaTK);
            req.session.user = userInf;
            req.session.role = 'customer';
            req.session.MaCN = parseInt(branch);
            if (user) {
                res.status(200).json({ status: true, user: user.MaTK });
            } else {
                res.status(401).json({ status: false, message: "Invalid username or password" });
            }
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    signup: async (req, res) => {
        try {
            const { username, password, info } = req.body;
            const user = await accountData.signup(username, password, info);
            res.status(200).json({ status: true, user: user });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    getInfo: async (req, res) => {
        try {
            const uid = req.params.uid;
            res.render('getUserInfo', { uid });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    getStaffLogin: async (req, res) => { 
        try {
            res.render('staffLogin');
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    staffLogin: async (req, res) => { 
        try {
            const staffLoginKey = req.body.loginKey;
            req.session.role = 'staff';
            if (staffLoginKey === 'StaffAgency1') {
                req.session.MaCN = 1;
                res.status(200).json({ status: true, message: "Login successful agc1", MaCN: 1 });
            }
            else if (staffLoginKey === 'StaffAgency2') {
                req.session.MaCN = 2;
                res.status(200).json({ status: true, message: "Login successful agc2", MaCN: 2 });
            }
            else if (staffLoginKey === 'StaffAgency3') {
                req.session.MaCN = 3;
                res.status(200).json({ status: true, message: "Login successful agc3", MaCN: 3 });
            }
            else if (staffLoginKey === 'StaffAgency4') {
                req.session.MaCN = 4;
                res.status(200).json({ status: true, message: "Login successful agc4", MaCN: 4 });
            }
            else if (staffLoginKey === 'StaffAgency5') {
                req.session.MaCN = 5;
                res.status(200).json({ status: true, message: "Login successful agc5", MaCN: 5 });
            }
            else if (staffLoginKey === 'StaffAgency6') {
                req.session.MaCN = 6;
                res.status(200).json({ status: true, message: "Login successful agc6", MaCN: 6 });
            }
            else if (staffLoginKey === 'StaffAgency7') {
                req.session.MaCN = 7;
                res.status(200).json({ status: true, message: "Login successful agc7", MaCN: 7 });
            }
            else if (staffLoginKey === 'StaffAgency8') {
                req.session.MaCN = 8;
                res.status(200).json({ status: true, message: "Login successful agc8", MaCN: 8 });
            }
            else if (staffLoginKey === 'StaffAgency9') {
                req.session.MaCN = 9;
                res.status(200).json({ status: true, message: "Login successful agc9", MaCN: 9 });
            }
            else if (staffLoginKey === 'StaffAgency10') {
                req.session.MaCN = 10;
                res.status(200).json({ status: true, message: "Login successful agc10", MaCN: 10 });
            }
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    }
};

export default authController;