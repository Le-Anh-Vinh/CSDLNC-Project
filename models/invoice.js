import sql from "mssql";

const invoiceData = {
    create: async (MaPTN, MaNV, MaTK) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaPTN', sql.Int);
            ps.input('MaNV', sql.Int);
            ps.input('MaTK', sql.Int);
            await ps.prepare(`EXEC sp_TaoHoaDonGiaoTanNha @MaPTN, @MaNV, @MaTK`);
            await ps.execute({ MaPTN, MaNV, MaTK });
            await ps.unprepare();

            const pSelect = new sql.PreparedStatement();
            pSelect.input('MaPTN', sql.Int);
            await pSelect.prepare('SELECT MAHDGTN FROM HOA_DON_GIAO_TAN_NHA WHERE MaPTNThanhToan = @MaPTN');
            const result = await pSelect.execute({ MaPTN });
            await pSelect.unprepare();
            if (result.recordset && result.recordset.length > 0) {
                return result.recordset[0].MAHDGTN;
            } else {
                console.log(`No MaHDGTN found for MaTK: ${MaPTN}`);
                return null; 
            }
        } catch (error) {
            console.log('ERROR IN CREATING INVOICE: ', error);
            return null;
        }
    },

    createSpot: async (MaPGM, MaTV) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaPGM', sql.Int);
            ps.input('MaTV', sql.Int);
            await ps.prepare('EXEC sp_TaoHoaDon_PGM @MaPGM, @MaTV');
            await ps.execute({ MaPGM, MaTV });
            await ps.unprepare();

            const pSelect = new sql.PreparedStatement();
            pSelect.input('MaPGM', sql.Int);
            await pSelect.prepare('SELECT MaHD FROM HOA_DON WHERE MaPGMThanhToan = @MaPGM');
            const result = await pSelect.execute({ MaPGM });
            await pSelect.unprepare();
            if (result.recordset && result.recordset.length > 0) {
                return result.recordset[0].MaHD;
            } else {
                console.log(`No MaHD found for MaPGM: ${MaPGM}`);
                return null; 
            }
        } catch (error) {
            console.log('ERROR IN CREATING SPOT INVOICE: ', error);
            return null;
        }
    },

    getByID: async (MaHDGTN) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaHDGTN', sql.Int);
            await ps.prepare(`EXEC sp_XemChiTietHoaDonTanNha @MaHDGTN`);
            const result = await ps.execute({ MaHDGTN });
            await ps.unprepare();
            return result.recordset[0];
        } catch (error) {
            console.log('ERROR IN GETTING INVOICE BY ID: ', error);
            return null;
        }
    },

    confirmDelivery: async (MaPTN) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaPTN', sql.Int);
            await ps.prepare('UPDATE HOA_DON_GIAO_TAN_NHA SET HoanThanhThanhToan = 1 WHERE MaPTNThanhToan = @MaPTN');
            await ps.execute({ MaPTN });
            await ps.unprepare();

            const pSelect = new sql.PreparedStatement();
            pSelect.input('MaPTN', sql.Int);
            await pSelect.prepare('SELECT MaHDGTN FROM HOA_DON_GIAO_TAN_NHA WHERE MaPTNThanhToan = @MaPTN');
            const result = await pSelect.execute({ MaPTN });
            await pSelect.unprepare();
            if (result.recordset && result.recordset.length > 0) {
                return result.recordset[0].MaHDGTN;
            } else {
                console.log(`No MaHDGTN found for MaPTN: ${MaPTN}`);
                return null; 
            }
        } catch (error) {
            console.log('ERROR IN CONFIRMING DELIVERY: ', error);
            return null;
        }
    },

    getSpotInvoice: async (MaHD) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaHD', sql.Int);
            await ps.prepare('SELECT * FROM HOA_DON WHERE MaHD = @MaHD');
            const result = await ps.execute({ MaHD });
            await ps.unprepare();
            return result.recordset[0];            
        } catch (error) {
            console.log('ERROR IN GETTING SPOT INVOICE: ', error);
            return null;
        }
    },

    updateSpotStatus: async (MaHD) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaHD', sql.Int);
            await ps.prepare('EXEC sp_HoanThanhThanhToan_HoaDon_PGM @MaHD');
            await ps.execute({ MaHD });
            await ps.unprepare();
        } catch (error) {
            console.log('ERROR IN UPDATING SPOT STATUS: ', error);
            return null;
        }
    },

    getByCustomer: async (MaTK) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaTK', sql.Int);
            await ps.prepare('EXEC sp_TruyVanOrderOnlineDaThanhToan @MaTK');
            const result = await ps.execute({ MaTK });
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log('ERROR IN GETTING INVOICE BY CUSTOMER: ', error);
            return null;
        }
    },
};

export default invoiceData;