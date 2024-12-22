import express from "express";
import authController from "../controllers/authController.js";
import deliveryController from "../controllers/deliveryController.js";
import userController from "../controllers/userController.js";
import dishController from "../controllers/dishController.js";
import invoiceController from "../controllers/invoiceController.js";

const router = express.Router();

// auth
// customer
router.get('/', authController.getAuth);
router.post('/login', authController.login);
router.post('/signup', authController.signup);
// staff
router.get('/staffLogin', authController.getStaffLogin);
router.post('/staffLogin', authController.staffLogin);

// cart
// using session
router.post('/cart', deliveryController.add);
router.put('/cart', deliveryController.add);
router.get('/cart', deliveryController.getCart);
router.delete('/cart', deliveryController.remove);

// delivery
router.post('/delivery', deliveryController.create);

// dish
router.put('/dish', dishController.updateStatus);

// user
router.get('/user/:MaCN', userController.getAll);

// employee
router.get('/employee/:MaCN', userController.getDelivery);
router.put('/employee/:MaCN', userController.confirmDeliver);

// invoice
router.post('/invoice', invoiceController.create);
router.get('/invoice/:MaHDGTN', invoiceController.get);

// statistics
router.get('/statistics/dish', dishController.getDishStatistics);


export default router;