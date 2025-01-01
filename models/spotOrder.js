import sql from "mssql";

const spotOrderData = {
    create: async (MaCN, SoBan, MaNVTaoPhieu) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaCN', sql.Int);
            ps.input('SoBan', sql.Int);
            ps.input('MaNVTaoPhieu', sql.Int);
            await ps.prepare('EXEC sp_TaoPGM @MaCN, @SoBan, @MaNVTaoPhieu');
            await ps.execute({ MaCN, SoBan, MaNVTaoPhieu });
            await ps.unprepare();

            // take MaPGM
            const pSelect = new sql.PreparedStatement();
            pSelect.input('MaNVTaoPhieu', sql.Int);
            await pSelect.prepare('SELECT TOP 1 MaPGM FROM PHIEU_GOI_MON WHERE MaNVTaoPhieu = @MaNVTaoPhieu ORDER BY MaPGM DESC');
            const result = await pSelect.execute({ MaNVTaoPhieu });
            await pSelect.unprepare();
            if (result.recordset && result.recordset.length > 0) {
                return result.recordset[0].MaPGM;
            } else {
                console.log(`No MaPGM found for MaNVTaoPhieu: ${MaNVTaoPhieu}`);
                return null; 
            }
        } catch (error) {
            console.log('ERROR IN INSERTING SPOT ORDER: ', error);
            return null;
        }
    },

    addDish: async (MaPGM, MaMA, quantity) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaPGM', sql.Int);
            ps.input('MaMA', sql.Int);
            ps.input('SoLuong', sql.Int);
            await ps.prepare('EXEC sp_ThemMonAnPGM @MaPGM, @MaMA, @SoLuong');
            await ps.execute({ MaPGM, MaMA, SoLuong: quantity });
            await ps.unprepare();
        } catch (error) {
            console.log('ERROR IN ADDING DISH TO SPOT ORDER: ', error);
            return null;
        }
    },

    createInvoice: async (MaPGM, MaTV) => {
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
            console.log('ERROR IN UPDATING STATUS: ', error);
            return null;
        }
    },

    getPendingByAgency: async (MaCN) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaCN', sql.Int);
            await ps.prepare('SELECT * FROM PHIEU_GOI_MON WHERE MaCN = @MaCN AND HoanThanhPGM = 0 AND CAST(NgayLapPGM AS DATE) = CAST(GETDATE() AS DATE)');
            const result = await ps.execute({ MaCN });
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log('ERROR IN GETTING BY AGENCY: ', error);
            return null;
        }
    },

    getBookedTables: async (MaCN, BookedDate) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaCN', sql.Int);
            ps.input('BookedDate', sql.Int);
            await ps.prepare(`EXEC sp_XemLichDatTruoc @MaCN, @BookedDate`);
            const result = await ps.execute({ MaCN, BookedDate });
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log('ERROR IN GETTING BOOKED TABLES: ', error);
            return null;
        }
    },

    getTablesByAgency: async (MaCN) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaCN', sql.Int);
            await ps.prepare('SELECT * FROM BAN WHERE MaCN = @MaCN');
            const result = await ps.execute({ MaCN });
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log('ERROR IN GETTING TABLES BY AGENCY: ', error);
            return null;
        }
    },

    createBooking: async (MaCN, SoBan, GioDen, SlKhach, SDT, GhiChu) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaCN', sql.Int);
            ps.input('SoBan', sql.Int);
            ps.input('GioDen', sql.DateTime);
            ps.input('SlKhach', sql.Int);
            ps.input('SDT', sql.VarChar(15));
            ps.input('GhiChu', sql.NVarChar(255));
            await ps.prepare('EXEC sp_DonDatBanOnline @MaCN, @SoBan, @GioDen, @SlKhach, @SDT, @GhiChu');
            await ps.execute({ MaCN, SoBan, GioDen, SlKhach, SDT, GhiChu });
            await ps.unprepare();
        } catch (error) {
            console.log('ERROR IN CREATING BOOKING: ', error);
            return null;
        }
    },
};

export default spotOrderData;