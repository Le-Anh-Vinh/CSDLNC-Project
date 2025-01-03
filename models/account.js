import sql from "mssql";

const accountData = {
    login: async (username, password) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('username', sql.VarChar);
            ps.input('password', sql.VarChar);
            await ps.prepare('SELECT * FROM TAI_KHOAN WHERE TenDangNhap = @username AND MatKhau = @password');
            const result = await ps.execute({ username: username, password: password })
            await ps.unprepare();
            if (result.recordset.length > 0) {
                console.log('Login successfully:', result.recordset[0]);
                return result.recordset[0];
            } else {
                console.log('Invalid username or password');
                return null;
            }
        } catch (error) {
            console.log('ERROR IN LOGIN: ', error);
            return null;
        }
    },

    signup: async (username, password, info) => {
        try {
            const ps = new sql.PreparedStatement();
            ps.input('username', sql.Char);
            ps.input('password', sql.Char);
            ps.input('TenHienThi', sql.NChar);
            ps.input('EmailTK', sql.Char);
            ps.input('MaTV', sql.Int);
            await ps.prepare('INSERT INTO TAI_KHOAN (TenDangNhap, MatKhau, TenHienThi, EmailTK, MaTV) VALUES (@username, @password)');
            const result = await ps.execute({ username: username, password: password, TenHienThi: info.name, EmailTK: info.email, MaTV: info.MaTV });
            if (result.rowsAffected > 0) {
                console.log('Signup successfully');
                return true;
            } else {
                console.log('Signup failed');
                return false;
            }
        } catch (error) {
            console.log('ERROR IN SIGNUP: ', error);
            return false;
        }
    },

    getByID: async (MaTK) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaTK', sql.Int);
            await ps.prepare('SELECT * FROM TAI_KHOAN WHERE MaTK = @MaTK');
            const result = await ps.execute({ MaTK: MaTK });
            await ps.unprepare();
            return result.recordset[0];
        } catch (error) {
            console.log('ERROR IN GETTING BY ID: ', error);
        }
    },

    getAdvancedInfoByID: async (MaTK) => { 
        try {
            const ps = new sql.PreparedStatement();
            ps.input('MaTK', sql.Int);
            await ps.prepare('SELECT TV.DiemTichLuyHienTai, TV.ThoiDiemThangHang FROM TAI_KHOAN TK JOIN THANH_VIEN TV ON TV.MaTV = TK.MaTV WHERE TK.MaTK = @MaTK');
            const result = await ps.execute({ MaTK: MaTK });
            await ps.unprepare();
            return result.recordset[0];
        } catch (error) {
            console.log('ERROR IN GETTING BY ID: ', error);
            return null;
        }
    }
}

export default accountData;