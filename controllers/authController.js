import accountData from "../models/account.js";
import MyError from "../cerror.js";
import dishData from "../models/dish.js";

const authController = {
    getAuth: (req, res) => {
        try {
            res.render('authentication');
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await accountData.login(username, password);

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

            if (staffLoginKey === 'StaffAgency1') {
                res.status(200).json({ status: true, message: "Login successful agc1", MaCN: 1 });
            }
            else if (staffLoginKey === 'StaffAgency2') {
                res.status(200).json({ status: true, message: "Login successful agc2", MaCN: 2 });
            }
            else if (staffLoginKey === 'StaffAgency3') {
                res.status(200).json({ status: true, message: "Login successful agc3", MaCN: 3 });
            }
            else if (staffLoginKey === 'StaffAgency4') {
                res.status(200).json({ status: true, message: "Login successful agc4", MaCN: 4 });
            }
            else if (staffLoginKey === 'StaffAgency5') {
                res.status(200).json({ status: true, message: "Login successful agc5", MaCN: 5 });
            }
            else if (staffLoginKey === 'StaffAgency6') {
                res.status(200).json({ status: true, message: "Login successful agc6", MaCN: 6 });
            }
            else if (staffLoginKey === 'StaffAgency7') {
                res.status(200).json({ status: true, message: "Login successful agc7", MaCN: 7 });
            }
            else if (staffLoginKey === 'StaffAgency8') {
                res.status(200).json({ status: true, message: "Login successful agc8", MaCN: 8 });
            }
            else if (staffLoginKey === 'StaffAgency9') {
                res.status(200).json({ status: true, message: "Login successful agc9", MaCN: 9 });
            }
            else if (staffLoginKey === 'StaffAgency10') {
                res.status(200).json({ status: true, message: "Login successful agc10", MaCN: 10 });
            }
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    }
};

export default authController;