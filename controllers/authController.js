import accountData from "../models/account.js";
import MyError from "../cerror.js";
import dishData from "../models/dish.js";

const authController = {
    getAuth: (req, res) => {
        try {
            res.render('login');
        } catch (error) {
            next(new MyError(404, "Can't found log in page"));
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await accountData.login(username, password);
            const dish = await dishData.getDish(1);
            if (user) {
                res.status(200).json({ status: true, user: user, dish: dish });
            } else {
                res.status(401).json({ status: false, message: "Invalid username or password" });
            }
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    signup: async (req, res) => {
        try {
            const { username, password, info } = req.body;
            const user = await accountData.signup(username, password, info);
            res.status(200).json({ status: true, user: user });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    getInfo: async (req, res) => {
        try {
            const uid = req.params.uid;
            res.render('getUserInfo', { uid });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    }
};

export default authController;