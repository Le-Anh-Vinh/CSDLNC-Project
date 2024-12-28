import sql from "mssql";

const evaluationData = {
    createOnline: async (MaPTN, DiemChatLuong, DiemGiaCa, BinhLuan) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaPTN', sql.Int);
            ps.input('DiemChatLuong', sql.Float);
            ps.input('DiemGiaCa', sql.Float);
            ps.input('BinhLuan', sql.NChar(50));
            await ps.prepare('EXEC sp_DanhGiaOnline @DiemChatLuong, @DiemGiaCa, @BinhLuan, @MaPTN');
            await ps.execute({ DiemChatLuong, DiemGiaCa, BinhLuan, MaPTN });
            await ps.unprepare();            
        } catch (error) {
            console.log('ERROR IN CREATING ONLINE EVALUATION: ', error);
            return null;
        }
    },

    createOnTheSpot: async (MaPGM, DiemPhucVu, DiemViTriChiNhanh, DiemChatLuongMonAn, DiemGiaCa, DiemVeKhongGianNhaHang, BinhLuan) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaPGM', sql.Int);
            ps.input('DiemPhucVu', sql.Float);
            ps.input('DiemViTriChiNhanh', sql.Float);
            ps.input('DiemChatLuongMonAn', sql.Float);
            ps.input('DiemGiaCa', sql.Float);
            ps.input('DiemVeKhongGianNhaHang', sql.Float);
            ps.input('BinhLuan', sql.NChar(50));
            await ps.prepare('EXEC sp_DanhGiaTrucTiep @DiemPhucVu, @DiemViTriChiNhanh, @DiemChatLuongMonAn, @DiemGiaCa, @DiemVeKhongGianNhaHang, @BinhLuan, @MaPGM');
            await ps.execute({ DiemPhucVu, DiemViTriChiNhanh, DiemChatLuongMonAn, DiemGiaCa, DiemVeKhongGianNhaHang, BinhLuan, MaPGM });
            await ps.unprepare();            
        } catch (error) {
            console.log('ERROR IN CREATING ON THE SPOT EVALUATION: ', error);
            return null;
        }
    }
};

export default evaluationData;