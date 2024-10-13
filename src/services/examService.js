import db from '../models/index';

let getAllExams = (examId, cateExamId, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            const limit = 8;
            const offset = (page - 1) * limit;

            console.log("exam id: ", examId);
            console.log("cate exam id: ", cateExamId);
            console.log("limit: ", limit);
            console.log("offset: ", offset);

            let exams = '';
            let totalCount = 0;

            if (examId === "ALL") {
                let result = await db.Exam.findAndCountAll({
                    attributes: {},
                    include: [
                        {
                            model: db.Category_Exam,
                            as: 'categoryExamData',
                            where: { id: cateExamId }
                        }
                    ],
                    limit: limit,
                    offset: offset,
                    raw: true,
                    nest: true
                });

                exams = result.rows;
                totalCount = result.count;
            }

            if (examId && examId !== 'ALL') {

                let result = await db.Exam.findOne({
                    where: { id: examId },
                    attributes: {}
                });

                exams = result;
                totalCount = 1;
            }

            resolve({
                exams: exams,
                totalCount: totalCount
            });
        } catch (e) {
            reject(e);
        }
    });
}


let createExam = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.titleExam === '') {
                resolve({
                    errCode: 1,
                    errMessage: 'Plz enter your title exam!'
                })
            } else {
                await db.Exam.create({
                    userId: data.userId,
                    categoryExamId: data.categoryExamId,
                    titleExam: data.titleExam,
                    stateExam: data.stateExam === '1' ? true : false,
                    countUserTest: data.countUserTest,

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

let updateExam = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                });
            }

            let exam = await db.Exam.findOne({
                where: { id: data.id },
                // raw: false
            })
            console.log("Check exam: ", exam);
            if (exam) {
                exam.categoryExamId = data.categoryExamId,
                    exam.titleExam = data.titleExam,
                    exam.stateExam = data.stateExam === '1' ? true : false,
                    exam.countUserTest = data.countUserTest,

                    await exam.save();

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

let deleteExam = (examId) => {
    return new Promise(async (resolve, reject) => {
        let exam = await db.Exam.findOne({
            where: { id: examId }
        })
        if (!exam) {
            resolve({
                errCode: 2,
                errMessage: `The exam isn't exist`
            })
        }
        await db.Exam.destroy({
            where: { id: examId }
        })
        resolve({
            errCode: 0,
            errMessage: `The exam is delete`
        })
    })
}

module.exports = {
    getAllExams: getAllExams,
    createExam: createExam,
    updateExam: updateExam,
    deleteExam: deleteExam,

}