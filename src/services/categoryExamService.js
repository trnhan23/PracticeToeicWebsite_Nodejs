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
                    },
                    include: [
                        {model: db.Exam, as: 'categoryExamData'}
                    ],
                    raw: true,
                    nest: true
                })
            }
            if (cateExamId && cateExamId !== 'ALL') {
                cateExams = await db.Category_Exam.findOne({
                    where: { id: cateExamId },
                    attributes: {
                    },
                    include: [
                        {model: db.Exam, as: 'categoryExamData'}
                    ]
                    // raw và nest này nếu không bỏ thì nó chỉ lấy được 1 bảng ghi ở exam 
                    //(trong khi đó có nhiều bảng ghi có khoá ngoại đến category_exam)
                    // ,
                    // raw: true,
                    // nest: true
                })
            }
            resolve(cateExams);
        } catch (e) {
            reject(e);
        }
    })
}

let createCateExam = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.titleCategoryExam === '') {
                resolve({
                    errCode: 1,
                    errMessage: 'Plz enter your title!'
                })
            } else {
                await db.Category_Exam.create({
                    userId: data.userId,
                    titleCategoryExam: data.titleCategoryExam,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    });
}

let updateCateExam = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                });
            }

            let cateExam = await db.Category_Exam.findOne({
                where: { id: data.id },
                // raw: false
            })
            console.log("Check cateExam: ", cateExam);
            if (cateExam) {
                cateExam.userId = data.userId,
                    cateExam.titleCategoryExam = data.titleCategoryExam,
                    await cateExam.save();

                resolve({
                    errCode: 0,
                    errMessage: 'Update the cate exam succeeds!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Category exam not not found`
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteCateExam = (cateExamId) => {
    return new Promise(async (resolve, reject) => {
        let cateExam = await db.Category_Exam.findOne({
            where: { id: cateExamId }
        })
        if (!cateExam) {
            resolve({
                errCode: 2,
                errMessage: `The category exam isn't exist`
            })
        }
        await db.Category_Exam.destroy({
            where: { id: cateExamId }
        })
        resolve({
            errCode: 0,
            errMessage: `The category exam is delete`
        })
    })
}
module.exports = {
    getAllCateExams: getAllCateExams,
    createCateExam: createCateExam,
    updateCateExam: updateCateExam,
    deleteCateExam: deleteCateExam,

}