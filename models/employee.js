import sql from "mssql";

const employeeData = {
    getByAgency: async (MaCN) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaCN', sql.Int);
            await ps.prepare('SELECT NV.MaNV FROM NHAN_VIEN NV JOIN LICH_SU_LAM_VIEC LS ON NV.MaNV = LS.MaNV WHERE LS.MaCN = @MaCN AND LS.NgayKetThucLam IS NULL');
            const result = await ps.execute({ MaCN });
            await ps.unprepare();
            return result.recordset;
        } catch (error) {
            console.log('ERROR IN GETTING EMPLOYEE BY AGENCY: ', error);
            return null;
        }
    },
};

export default employeeData;