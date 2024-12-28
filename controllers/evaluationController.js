import evaluationData from "../models/evaluation.js";

const evaluationController = {
    getAddOnline: async (req, res) => { 
        try {
            const MaPTN = req.body;
            res.render('evaluationOnline', { MaPTN });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    addOnline: async (req, res) => {
        try {
            const { MaPTN, DiemChatLuong, DiemGiaCa, BinhLuan } = req.body;
            if (DiemChatLuong < 0 || DiemChatLuong > 5 || DiemGiaCa < 0 || DiemGiaCa > 5) {
                res.status(404).json({ status: false, message: "Evaluation created unsuccessfully with invalid grade!" });
                return;
            }   
            await evaluationData.createOnline(MaPTN, DiemChatLuong, DiemGiaCa, BinhLuan);
            res.status(200).json({ status: true, message: "Evaluation created successfully!" });
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    },

    getAddOnTheSpot: async (req, res) => {
        try {
            const MaPGM = req.body;
            res.render('evaluationOnTheSpot', { MaPGM });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    addOnTheSpot: async (req, res) => { 
        try {
            const { MaPGM, DiemPhucVu, DiemViTriChiNhanh, DiemChatLuongMonAn, DiemGiaCa, DiemVeKhongGianNhaHang, BinhLuan } = req.body;
            if (DiemPhucVu < 0 || DiemPhucVu > 5 || DiemViTriChiNhanh < 0 || DiemViTriChiNhanh > 5 || DiemChatLuongMonAn < 0 || DiemChatLuongMonAn > 5 || DiemGiaCa < 0 || DiemGiaCa > 5 || DiemVeKhongGianNhaHang < 0 || DiemVeKhongGianNhaHang > 5) {
                res.status(404).json({ status: false, message: "Evaluation created unsuccessfully with invalid grade!" });
                return;
            }   
            await evaluationData.createOnTheSpot(MaPGM, DiemPhucVu, DiemViTriChiNhanh, DiemChatLuongMonAn, DiemGiaCa, DiemVeKhongGianNhaHang, BinhLuan);
            res.status(200).json({ status: true, message: "Evaluation created successfully!" });           
        } catch (error) {
            res.status(404).json({ status: false, error: error.message });
        }
    }
};

export default evaluationController;