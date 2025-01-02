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
router.put('/spot/:MaPGM', spotController.updateStatus); // spot order is done, update status and create invoice
// dish
router.put('/dish', dishController.updateStatus); // update dish status unavailable

// user
router.get('/user', userController.getAll); // homepage for customer in website
router.get('/search', userController.search); // search for dishes by keywords
// employee
router.get('/employee', userController.getAll); // homepage for staff in website

// employee
// online
router.get('/employee/online', userController.getDelivery);  // get all pending delivery orders of an agency
router.put('/employee/online/confirmOrder', userController.confirmOrderOnline); // staff confirms delivery order
router.put('/employee/online/confirmDelivery', userController.confirmDelivery); // staff confirms payment
// on the spot
router.get('/employee/spot', userController.getSpot); // get all pending spot orders of an agency
router.put('/employee/spot/confirmOrder', userController.confirmOrderSpot); // staff confirms spot order

// invoice
router.post('/invoice/online', invoiceController.create); // create an invoice for a delivery order
router.get('/invoice/online/:MaHDGTN', invoiceController.getOnline); // get invoice by ID
router.get('/invoice/spot/:MaHD', invoiceController.getAtSpot); // get invoice by ID
router.put('/invoice/spot/:MaHD', invoiceController.paymentConfirm); // update invoice status
router.get('/invoice/history', invoiceController.customerInvoices); // get all orders of a customer

// statistics
router.get('/statistics/dish', dishController.getDishStatistics); // get statistics of dishes of an agency in a period

// evaluation
// online
router.get('/evaluation/online/:MaPTN', evaluationController.getAddOnline); // get evaluation form for online order
router.post('/evaluation/online', evaluationController.addOnline); // add evaluation for online order
// on the spot
router.get('/evaluation/spot/:MaPGM', evaluationController.getAddOnTheSpot); // get evaluation form for on the spot order
router.post('/evaluation/spot', evaluationController.addOnTheSpot); // add evaluation for on the spot order

// booking table
router.get('/getDate', spotController.getDateBooking); // get non booked tables of an agency
router.get('/booking', spotController.getBooking); // get non booked tables of an agency in a date
router.post('/booking', spotController.bookTable); // book a table for a customer
router.get('/booked', spotController.getBooked); // get booked tables of an agency in a date
export default router;