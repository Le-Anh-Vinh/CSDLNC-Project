import sql from 'mssql'

const agencyData = {
    getAll: async () => { 
        try {
            const ps = new sql.PreparedStatement();
            await ps.prepare('SELECT MaCN, TenCN FROM CHI_NHANH');
            const result = await ps.execute();
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log("ERROR WHEN GETTING AGENCY");
            return null;
        }
    },

    getEmptyTable: async (MaCN) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaCN', sql.Int);
            await ps.prepare('SELECT * FROM BAN WHERE MaCN = @MaCN AND TrangThaiSuDung = 0');
            const result = await ps.execute({ MaCN });
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log("ERROR WHEN GETTING EMPTY TABLES");
            return null;
        }
    }
}

export default agencyData;