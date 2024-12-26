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
// for both customer and staff  (staff order for customer on the spot)
router.post('/cart', deliveryController.add); // add a dish to cart
router.put('/cart', deliveryController.add); // add a dish to cart
router.get('/cart', deliveryController.getCart); // get all dishes in cart
router.delete('/cart', deliveryController.remove); // remove a dish from cart

// delivery
router.post('/delivery', deliveryController.create); // create a delivery order based on cart in session
router.get('/delivery/order', deliveryController.get); // get all delivery orders of a customer (MaTK)

// on the spot
router.post('/spot', spotController.create); // create a spot order based on cart in session (employees order for customer)
router.post('/spot/:MaPGM', spotController.addDish); // add dish to an existing spot order
router.put('/spot/:MaPGM', spotController.updateStatus); // spot order is done
// dish
router.put('/dish', dishController.updateStatus); // update dish status unavailable

// user
router.get('/user/:MaCN', userController.getAll); // homepage for customer in website
router.get('/user/search/:MaCN', userController.search); // search for dishes by keywords


// employee
// online
router.get('/employee/online/:MaCN', userController.getDelivery);  // get all pending delivery orders of an agency
router.put('/employee/online/confirmOrder/:MaCN', userController.confirmOrder); // staff confirms delivery order
router.put('/employee/online/confirmDelivery/:MaCN', userController.confirmDelivery); // staff confirms payment
// on the spot
router.get('/employee/spot/:MaCN', userController.getSpot); // get all pending spot orders of an agency

// invoice
router.post('/invoice', invoiceController.create); // create an invoice for a delivery order
router.get('/invoice/:MaHDGTN', invoiceController.get); // get invoice by ID

// statistics
router.get('/statistics/dish', dishController.getDishStatistics); // get statistics of dishes of an agency in a period

// evaluation
// online
router.get('/evaluation/online', evaluationController.getAddOnline); // get evaluation form for online order
router.post('/evaluation/online', evaluationController.addOnline); // add evaluation for online order
// on the spot
router.get('/evaluation/spot', evaluationController.getAddOnTheSpot); // get evaluation form for on the spot order
router.post('/evaluation/spot', evaluationController.addOnTheSpot); // add evaluation for on the spot order


export default router;