import sql from "mssql";

const invoiceData = {
    create: async (MaPTN, MaNV, MaTK) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaPTN', sql.Int);
            ps.input('MaNV', sql.Int);
            ps.input('MaTK', sql.Int);
            await ps.prepare(`EXEC Generate_HDGTN @MaPTN, @MaNV, @MaTK`);
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

    getByID: async (MaHDGTN) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaHDGTN', sql.Int);
            await ps.prepare(`EXEC sp_XemChiTietHoaDonTanNha @MaHDGTN`);
            const result = await ps.execute({ MaHDGTN });
            await ps.unprepare();
            return result.recordset;
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
        } catch (error) {
            console.log('ERROR IN CONFIRMING DELIVERY: ', error);
            return null;
        }
    }
};

export default invoiceData;