import db from '../models/index';

let getAllCateExams = (cateExamId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("cate-exam: ", cateExamId);

            let cateExams = '';
            if (cateExamId === "ALL") {
                cateExams = await db.Category_Exam.findAll({
                    attributes: {
                        // exclude: ['password']
                    }
                });
            }
            // Nếu cateExamId không phải là "ALL", thì tìm theo id
            else if (cateExamId && cateExamId !== 'ALL') {
                cateExams = await db.Category_Exam.findOne({
                    where: { id: cateExamId },
                    attributes: {
                        // exclude: ['password']
                    }
                });
            }

            // Kiểm tra nếu không tìm thấy kết quả
            if (!cateExams) {
                resolve({
                    errCode: 1,
                    errMessage: "Category Exam not found"
                });
            } else {
                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    cateExams
                });
            }
        } catch (e) {
            console.error("Error in getAllCateExams:", e);
            reject({
                errCode: 500,
                errMessage: 'Internal server error',
                error: e.message
            });
        }
    });
}


module.exports = {
    getAllCateExams: getAllCateExams,

}