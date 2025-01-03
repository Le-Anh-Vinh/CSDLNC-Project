import spotOrderData from "../models/spotOrder.js";
import dishData from "../models/dish.js";

const spotController = {
    create: async (req, res) => {
        try {
            const { MaCN, SoBan, MaNVTaoPhieu } = req.body;

            let cartItems = [];
            if (req.session.cart) {
                if (Array.isArray(req.session.cart)) {
                    cartItems = req.session.cart;
                } else {
                    cartItems.push(req.session.cart);
                }
            } else {
                res.status(404).json({ status: false, message: "Cart is empty" });
                return;
            }
            const result = await spotOrderData.create(MaCN, SoBan, MaNVTaoPhieu);

            for (const item of cartItems) {
                const { dishID, quantity } = item;
                await spotOrderData.addDish(result, dishID, quantity);
            }
            req.session.cart = [];
            res.status(200).json({ status: true, message: "Order created successfully!" });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    addDish: async (req, res) => {
        try {
            const MaPGM = req.params.MaPGM;

            let cartItems = [];
            if (req.session.cart) {
                if (Array.isArray(req.session.cart)) {
                    cartItems = req.session.cart;
                } else {
                    cartItems.push(req.session.cart);
                }
            } else {
                res.status(404).json({ status: false, message: "Cart is empty" });
                return;
            }

            for (const item of cartItems) {
                const { dishID, quantity } = item;
                await spotOrderData.addDish(MaPGM, dishID, quantity);
            }
            req.session.cart = [];
            res.status(200).json({ status: true, message: "Dish added successfully!" });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    updateStatus: async (req, res) => { 
        try {
            const MaPGM = req.params.MaPGM;
            const { MaTV } = req.body;
            await spotOrderData.updateStatus(MaPGM, MaTV);
            res.status(200).json({ status: true, message: "Order finished!" });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    getBooking: async (req, res) => { 
        try {
            const MaCN = req.session.MaCN;
            const date = req.query.date;
            const time = req.query.time;
            const dateTime = new Date(`${date}T${time}:00Z`);
            const inputDate = new Date(`${date}T00:00:00Z`);
    
            const today = new Date();
    
            inputDate.setUTCHours(0, 0, 0, 0); 
            today.setUTCHours(0, 0, 0, 0); 
    
            const timeDiff = inputDate - today;
            const daysDifference = timeDiff / (1000 * 3600 * 24);
    
            const week = Math.floor(daysDifference / 7) + 1;
            const bookedTables = await spotOrderData.getBookedTables(MaCN, week);
            const availableTables = bookedTables.filter(bookedTable => {
                const gioDen = new Date(bookedTable.GioDen);
                gioDen.setUTCHours(0, 0, 0, 0);
                const gioDenDate = `${gioDen.getUTCFullYear()}-${(gioDen.getUTCMonth() + 1).toString().padStart(2, '0')}-${gioDen.getUTCDate().toString().padStart(2, '0')}`;
                const inputDateStr = `${inputDate.getUTCFullYear()}-${(inputDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${inputDate.getUTCDate().toString().padStart(2, '0')}`;
                return gioDenDate === inputDateStr;
            });
            const tables = await spotOrderData.getTablesByAgency(MaCN);
            const nonBookedTables = tables.filter(table => !availableTables.find(availableTable => availableTable.SoBan === table.SoBan));
            const dishes = await dishData.getDish(MaCN);
            res.render('ThongTinDatBan', { Tables: nonBookedTables, dishes: dishes, dateTime: dateTime });
        } catch (error) {
            console.error("Error in getBooking:", error);
            res.status(404).json({ status: false, error: error.message });
        }
    },
    
    bookTable: async (req, res) => { 
        try {
            const MaCN = req.session.MaCN;
            const { reservationDate, reservationTime, tableID, customerQuantity, customerPhone, customerNote } = req.body;
            const dateTime = new Date(`${reservationDate}T${reservationTime}:00Z`);
            const result = await spotOrderData.createBooking(MaCN, tableID, dateTime, customerQuantity, customerPhone, customerNote);
            let cartItems = [];
            if (req.session.cart) {
                if (Array.isArray(req.session.cart)) {
                    cartItems = req.session.cart;
                } else {
                    cartItems.push(req.session.cart);
                }
            } else {
                res.status(200).json({ status: true, message: "Table booked successfully without any dishes!", MaPGM: result });
                return;
            }
            
            for (const item of cartItems) {
                const { dishID, quantity } = item;
                await spotOrderData.addDish(result, dishID, quantity);
            }
            req.session.cart = [];
            res.status(200).json({ status: true, message: "Table booked successfully with some dishes!"});
        } catch (error) {
            console.error("Error in bookTable:", error);
            res.status(404).json({ status: false, error: error.message });
        }
    },
    
    getDateBooking: async (req, res) => { 
        try {
            res.render('nhapNgayDatBan');            
        } catch (error) {
            console.error("Error in getDateBooking:", error);
            res.status(404).json({ status: false, error: error.message });
        }
    },

    getBooked: async (req, res) => {
        try {
            const MaCN = req.session.MaCN;
            const bookedTables = await spotOrderData.getBookedTables(MaCN, 1);
    
            // Lấy ngày hôm nay
            const today = new Date();
            today.setHours(0, 0, 0, 0);
    
            // Lọc các đơn trong hôm nay
            const todayBookings = bookedTables.filter((booking) => {
                const bookingDate = new Date(booking.GioDen);
                return bookingDate.toDateString() === today.toDateString();
            });
    
            todayBookings.sort((a, b) => new Date(a.GioDen) - new Date(b.GioDen));
    
            const formattedBookings = todayBookings.map((booking) => ({
                ...booking,
                GioDen: new Date(booking.GioDen).toLocaleString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            }));
    
            res.render('DanhSachDonDatBan', { status: true, Reservation_list: formattedBookings });
        } catch (error) {
            console.error("Error in getBooked:", error);
            res.status(404).json({ status: false, error: error.message });
        }
    }
};

export default spotController;