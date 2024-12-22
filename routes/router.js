import express from "express";
import authController from "../controllers/authController.js";
import deliveryController from "../controllers/deliveryController.js";
import userController from "../controllers/userController.js";
import dishController from "../controllers/dishController.js";
import invoiceController from "../controllers/invoiceController.js";
import evaluationController from "../controllers/evaluationController.js";
import spotController from "../controllers/spotController.js";

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
// for both customer and staff  (staff can order for customer)
router.post('/cart', deliveryController.add);
router.put('/cart', deliveryController.add);
router.get('/cart', deliveryController.getCart);
router.delete('/cart', deliveryController.remove);

// delivery
router.post('/delivery', deliveryController.create);

// on the spot
router.post('/spot', spotController.create);
router.post('/spot/:MaPGM', spotController.addDish);
router.put('/spot/:MaPGM', spotController.updateStatus);

// dish
router.put('/dish', dishController.updateStatus);

// user
router.get('/user/:MaCN', userController.getAll);

// employee
// online
router.get('/employee/online/:MaCN', userController.getDelivery);
router.put('/employee/online/:MaCN', userController.confirmDeliver);
// on the spot
router.get('/employee/spot/:MaCN', userController.getSpot);

// invoice
router.post('/invoice', invoiceController.create);
router.get('/invoice/:MaHDGTN', invoiceController.get);

// statistics
router.get('/statistics/dish', dishController.getDishStatistics);

// evaluation
// online
router.get('/evaluation/online', evaluationController.getAddOnline);
router.post('/evaluation/online', evaluationController.addOnline);
// on the spot
router.get('/evaluation/spot', evaluationController.getAddOnTheSpot);
router.post('/evaluation/spot', evaluationController.addOnTheSpot);


export default router;