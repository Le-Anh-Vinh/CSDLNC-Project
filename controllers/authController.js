import account from "../models/account.js";
import MyError from "../cerror.js";

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
            const user = await account.login(username, password);
            if (user) {
                res.status(200).json({ status: true, user: user });
            } else {
                res.status(401).json({ status: true, message: "Invalid username or password" });
            }
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    signup: async (req, res) => {
        try {
            const { username, password, info } = req.body;
            const user = await account.signup(username, password, info);
            res.status(200).json({ status: true, user: user });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    }
};

export default authController;