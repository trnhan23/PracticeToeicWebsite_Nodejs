import db from '../models/index';

let get8LatestExams = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let errCode;
            let errMessage;
            let result = await db.Exam.findAll({
                limit: 8,
                order: [['createdAt', 'DESC']],
                raw: true,
                nest: true
            });
            if (result && result.length > 0) {
                errCode = 0;
                errMessage = 'ok'
            } else {
                errCode = 1;
                errMessage = 'No exam in database'
            }
            resolve({
                errCode: errCode,
                errMessage: errMessage,
                exams: result
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getAllExams = (cateExamId, userId, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            const limit = 8;
            const offset = (page - 1) * limit;

            let result = await db.Exam.findAndCountAll({
                include: [
                    {
                        model: db.Category_Exam,
                        as: 'categoryExamData',
                        where: { id: cateExamId },
                        attributes: ['id', 'titleCategoryExam'] // Chỉ lấy các trường cần thiết
                    },
                    {
                        model: db.User_Exam,
                        as: 'userExam_ExamData',
                        where: { userId: userId },
                        attributes: ['userId', 'examId', 'statusExam'], // Lấy các trường cần thiết
                        required: false // Đảm bảo kết nối là LEFT JOIN
                    }
                ],
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']],
                raw: false,
                nest: true
            });

            let exams = result.rows;
            let totalCount = result.count;

            if (!exams || exams.length === 0) {
                return resolve({
                    exams: [],
                    totalCount: 0
                });
            }

            resolve({
                exams: exams,
                totalCount: totalCount
            });

        } catch (e) {
            console.error("Error fetching exams: ", e);
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
                const examData = await db.Exam.create({
                    userId: data.userId,
                    categoryExamId: data.categoryExamId,
                    titleExam: data.titleExam,
                    stateExam: data.stateExam === '1' ? true : false,
                    countUserTest: data.countUserTest,
                    countComment: data.countComment

                })
                resolve({
                    errCode: 0,
                    id: examData.id,
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
                    exam.countComment = data.countComment
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

let practiceExam = (examId, questionType) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = '';
            if (questionType === 'ALL') {
                result = await db.Reading_And_Listening.findAll({
                    where: {
                        examId: examId,
                    },
                    include: [
                        {
                            model: db.RL_And_QA,
                            as: 'RLQA_ReadAndListenData',
                            attributes: ['id', 'readAndListenId', 'questionAndAnswerId'],
                            include: [
                                {
                                    model: db.Question_And_Answer,
                                    as: 'RLQA_QuestionAndAnswerData',
                                    attributes: ['id', 'questionText', 'answerA', 'answerB', 'answerC', 'answerD', 'correctAnswer', 'numberQuestion']
                                }
                            ],
                            order: [['numberQuestion', 'DESC']],
                        }
                    ]
                });
            } else if (questionType === "Part 1" ||
                questionType === "Part 2" ||
                questionType === "Part 3" ||
                questionType === "Part 4" ||
                questionType === "Part 5" ||
                questionType === "Part 6" ||
                questionType === "Part 7") {
                result = await db.Reading_And_Listening.findAll({
                    where: {
                        examId: examId,
                        questionType: questionType
                    },
                    include: [
                        {
                            model: db.RL_And_QA,
                            as: 'RLQA_ReadAndListenData',
                            attributes: ['id', 'readAndListenId', 'questionAndAnswerId'],
                            include: [
                                {
                                    model: db.Question_And_Answer,
                                    as: 'RLQA_QuestionAndAnswerData',
                                    attributes: ['id', 'questionText', 'answerA', 'answerB', 'answerC', 'answerD', 'correctAnswer', 'numberQuestion']
                                }
                            ],
                            order: [['numberQuestion', 'DESC']],
                        }
                    ]
                });
            }

            resolve({
                examId: examId,
                questionType: questionType,
                data: result
            });
        } catch (e) {
            console.error("Error fetching exams: ", e);
            reject(e);
        }
    });
};

let getAnswerExam = (examId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await db.Reading_And_Listening.findAll({
                where: {
                    examId: examId
                },
                attributes: ['id', 'questionType'],
                include: [
                    {
                        model: db.RL_And_QA,
                        as: 'RLQA_ReadAndListenData',
                        attributes: ['id'],
                        include: [
                            {
                                model: db.Question_And_Answer,
                                as: 'RLQA_QuestionAndAnswerData',
                                attributes: ['id', 'correctAnswer', 'numberQuestion']
                            }
                        ],
                        order: [['numberQuestion', 'DESC']],
                    }
                ]
            });
            resolve({
                examId: examId,
                data: result
            });
        } catch (e) {
            console.error("Error fetching answers: ", e);
            reject(e);
        }
    })
}

let getAnswerByPart = (examId, part) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {}
            if (part !== 'all') {
                result = await db.Reading_And_Listening.findAll({
                    where: {
                        examId: examId,
                        questionType: part
                    },
                    attributes: ['id', 'questionType'],
                    include: [
                        {
                            model: db.RL_And_QA,
                            as: 'RLQA_ReadAndListenData',
                            attributes: ['id'],
                            include: [
                                {
                                    model: db.Question_And_Answer,
                                    as: 'RLQA_QuestionAndAnswerData',
                                    attributes: ['correctAnswer', 'numberQuestion']
                                }
                            ],
                            order: [['numberQuestion', 'DESC']],
                        }
                    ]
                });
            } else {
                result = await db.Reading_And_Listening.findAll({
                    where: {
                        examId: examId,
                    },
                    attributes: ['id', 'questionType'],
                    include: [
                        {
                            model: db.RL_And_QA,
                            as: 'RLQA_ReadAndListenData',
                            attributes: ['id'],
                            include: [
                                {
                                    model: db.Question_And_Answer,
                                    as: 'RLQA_QuestionAndAnswerData',
                                    attributes: ['correctAnswer', 'numberQuestion']
                                }
                            ],
                            order: [['numberQuestion', 'DESC']],
                        }
                    ]
                });
            }

            let format = formatCorrectAnswers(result);
            resolve({
                examId: examId,
                data: format
            });
        } catch (e) {
            console.error("Error fetching answers: ", e);
            reject(e);
        }
    })
}

let formatCorrectAnswers = (data) => {
    const formattedAnswers = {};

    data.forEach(item => {
        const part = item.questionType;

        if (!formattedAnswers[part]) {
            formattedAnswers[part] = {};
        }

        if (item.RLQA_ReadAndListenData && Array.isArray(item.RLQA_ReadAndListenData)) {
            item.RLQA_ReadAndListenData.forEach(readAndListenData => {
                if (readAndListenData.RLQA_QuestionAndAnswerData && Array.isArray([readAndListenData.RLQA_QuestionAndAnswerData])) {
                    const questionData = readAndListenData.RLQA_QuestionAndAnswerData;

                    formattedAnswers[part][questionData.numberQuestion] = questionData.correctAnswer;
                }
            });
        }
    });

    return formattedAnswers;
};

let getExam = (examId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!examId) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                });
            }

            let exam = await db.Exam.findOne({
                where: { id: examId },
                include: [
                    {
                        model: db.User_Exam,
                        as: 'userExam_ExamData',
                        attributes: ['statusExam'],
                    }
                ]
            })
            resolve(exam)
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    get8LatestExams: get8LatestExams,
    getAllExams: getAllExams,
    createExam: createExam,
    updateExam: updateExam,
    deleteExam: deleteExam,
    practiceExam: practiceExam,
    getAnswerExam: getAnswerExam,
    getAnswerByPart: getAnswerByPart,
    formatCorrectAnswers: formatCorrectAnswers,
    getExam: getExam,
}