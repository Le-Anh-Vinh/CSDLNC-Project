import sql from "mssql";

const deliveryData = {
    create: async (Address, Phone, Note, MaTK, MaCN) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('Address', sql.NVarChar);
            ps.input('Phone', sql.VarChar);
            ps.input('Note', sql.NVarChar);
            ps.input('MaTK', sql.Int);
            ps.input('MaCN', sql.Int);
            await ps.prepare('EXEC sp_TaoPhieuTanNha @Address, @Phone, @Note, @MaTK, @MaCN');
            await ps.execute({ Address, Phone, Note, MaTK, MaCN });
            await ps.unprepare();
            
            // take MaPTN
            const pSelect = new sql.PreparedStatement();
            pSelect.input('MaTK', sql.Int);
            await pSelect.prepare('SELECT TOP 1 MaPTN FROM PHIEU_TAN_NHA WHERE MaTKTao = @MaTK ORDER BY MaPTN DESC');
            const result = await pSelect.execute({ MaTK });
            await pSelect.unprepare();
            if (result.recordset && result.recordset.length > 0) {
                return result.recordset[0].MaPTN;
            } else {
                console.log(`No MaPTN found for MaTK: ${MaTK}`);
                return null; 
            }
        } catch (error) {
            console.log('ERROR IN INSERTING DELIVERY: ', error);
            return null;
        }
    },

    addDish: async (MaPTN, MaMA, quantity) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaPTN', sql.Int);
            ps.input('MaMA', sql.Int);
            ps.input('SoLuong', sql.Int);
            await ps.prepare('EXEC sp_ThemMonAnPTN @MaPTN, @MaMA, @SoLuong');
            await ps.execute({ MaPTN, MaMA, SoLuong: quantity });
            await ps.unprepare();
        } catch (error) {
            console.log('ERROR IN ADDING DISH TO DELIVERY: ', error);
            return null;
        }
    },

    getPendingByAgency: async (MaCN) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaCN', sql.Int);
            await ps.prepare('SELECT * FROM PHIEU_TAN_NHA WHERE MaCNDat = @MaCN AND MaNVXacNhan IS NULL');
            const result = await ps.execute({ MaCN });
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log('ERROR IN GETTING BY AGENCY: ', error);
            return null;
        }
    },

    confirmOrder: async (MaPTN, MaNV) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaPTN', sql.Int);
            ps.input('MaNV', sql.Int);
            await ps.prepare('UPDATE PHIEU_TAN_NHA SET MaNVXacNhan = @MaNV WHERE MaPTN = @MaPTN');
            await ps.execute({ MaPTN, MaNV });
            await ps.unprepare();
        } catch (error) {
            console.log('ERROR IN CONFIRMING DELIVERY ORDER: ', error);
            return null;
        }
    },

    getByCustomer: async (MaTK) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaTK', sql.Int);
            await ps.prepare('SELECT PTN.MaPTN, PTN.DiaChiGiaoHang, PTN.SDTDatHang, PTN.NgayLapPTN FROM PHIEU_TAN_NHA PTN JOIN HOA_DON_GIAO_TAN_NHA HDGTN ON PTN.MaPTN = HDGTN.MaPTNThanhToan WHERE PTN.MaTKTao = @MaTK AND HDGTN.HoanThanhThanhToan = 1 AND NOT EXISTS (SELECT 1 FROM DANH_GIA_ONLINE WHERE MaPTN = PTN.MaPTN)');
            const result = await ps.execute({ MaTK });
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log('ERROR IN GETTING INVOICE BY CUSTOMER: ', error);
            return null;
        }
    },
};

export default deliveryData;