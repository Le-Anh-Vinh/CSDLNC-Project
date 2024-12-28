import sql from "mssql";

const dishData = {
    getDish: async (MaCN) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaCN', sql.Int);
            await ps.prepare(`
                SELECT MA.MaMA, MA.TenMA, MA.GiaMA, MA.MoTa, MA.HoTroGiaoHang
                FROM MON_AN MA
                    JOIN THUC_DON_MON_AN TDMA ON MA.MaMA = TDMA.MaMA
                    JOIN CHI_NHANH CN ON TDMA.MaTD = CN.MaTDSuDDung
                WHERE CN.MaCN = @MaCN AND TDMA.PhucVu = 1
            `);
            const result = await ps.execute({ MaCN });
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log('ERROR IN GET DISH: ', error);
            return null;
        }
    },

    getByCategory: async (MaCN, MucChon) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaCN', sql.Int);
            ps.input('MucChon', sql.NVarChar);
            await ps.prepare(`
                SELECT MA.MaMA, MA.TenMA, MA.GiaMA, MA.MoTa, MA.HoTroGiaoHang
                FROM MON_AN MA
                    JOIN THUC_DON_MON_AN TDMA ON MA.MaMA = TDMA.MaMA
                    JOIN CHI_NHANH CN ON TDMA.MaTD = CN.MaTDSuDDung
                WHERE CN.MaCN = @MaCN AND TDMA.MucChon = @MucChon
            `);
            const result = await ps.execute({ MaCN, MucChon });
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log('ERROR IN GET DISH BY CATEGORY: ', error);
            return null;
        }
    },

    getByID: async (MaMA) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaMA', sql.Int);
            await ps.prepare(`
                SELECT MA.TenMA, MA.GiaMA, MA.MoTa
                FROM MON_AN MA
                WHERE MA.MaMA = @MaMA
            `);
            const result = await ps.execute({ MaMA });
            await ps.unprepare();
            return result.recordset[0];
        } catch (error) {
            console.log('ERROR IN GETTING DISH BY ID: ', error);
            return null;
        }
    },

    updateStatus: async (MaMA, MaTD, status) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaMA', sql.Int);
            ps.input('MaTD', sql.Int);
            ps.input('PhucVu', sql.Bit);
            await ps.prepare(`
                UPDATE THUC_DON_MON_AN
                SET PhucVu = @PhucVu
                WHERE MaMA = @MaMA AND 
                      MaTD = @MaTD
            `);
            const result = await ps.execute({ MaMA, MaTD, PhucVu: status });
            await ps.unprepare();
            return result.rowsAffected;
        } catch (error) {
            console.log('ERROR IN UPDATE STATUS: ', error);
            return null;
        }
    },

    getStatisticsByAgency: async (MaCN, StartDate, EndDate) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaCN', sql.Int);
            ps.input('StartDate', sql.Date);
            ps.input('EndDate', sql.Date);
            await ps.prepare(`EXEC sp_LuotBanMonAnGiaoTanNha @StartDate, @EndDate, @MaCN`);
            const result = await ps.execute({ MaCN, StartDate, EndDate });
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log('ERROR IN GETTING STATISTICS BY AGENCY: ', error);
            return null;
        }
    },

    search: async (MaCN, keyword) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaCN', sql.Int);
            ps.input('Keyword', sql.NVarChar);
            await ps.prepare(`
                SELECT MA.TenMA, MA.GiaMA, MA.MoTa
                FROM MON_AN MA
                    JOIN THUC_DON_MON_AN TDMA ON MA.MaMA = TDMA.MaMA
                    JOIN CHI_NHANH CN ON TDMA.MaTD = CN.MaTDSuDDung
                WHERE CN.MaCN = @MaCN AND 
                      MA.TenMA LIKE '%' + @Keyword + '%' AND
                      MA.HoTroGiaoHang = 1
            `);
            const result = await ps.execute({ MaCN, Keyword: keyword });
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log('ERROR IN SEARCHING: ', error);
            return null;
        }
    },

    priceOfDish: async (MaMA) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaMA', sql.Int);
            await ps.prepare('SELECT TenMA, GiaMA FROM MON_AN WHERE MaMA = @MaMA');
            const result = await ps.execute({ MaMA });
            await ps.unprepare();
            return result.recordset[0];
        } catch (error) {
            console.log('ERROR IN GETTING PRICE OF DISH: ', error);
            return null;
        }
    },

    getByOnlineOrder: async (MaPTN) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaPTN', sql.Int);
            await ps.prepare(`
                SELECT MA.TenMA, PTN.SoLuong
                FROM PTN_MON_AN PTN, MON_AN MA
                WHERE PTN.MaMA = MA.MaMA AND
                      PTN.MaPTN = @MaPTN
            `);
            const result = await ps.execute({ MaPTN });
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log('ERROR IN GETTING DISH BY ONLINE ORDER: ', error);
            return null;
        }
    }
}

export default dishData;