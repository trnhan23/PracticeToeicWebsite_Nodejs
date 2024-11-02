import db from '../models/index';

// lưu kết quả làm bài
let saveTestResult = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // tạo test
            let test = await createTest(data.test);
            console.log("Test: ", test);

            // tạo 1 loạt test result
            let testResult = await bulkCreateTestResult(test.testId, data.result.questions);
            console.log("testResult: ", testResult);

            // tính toán số câu làm đúng, sai, tổng
            let cal = await calculateCorrectAnswer(testResult);
            console.log("Cal: ", cal);
            // đếm câu theo Part
            let count = await countQuestionByPart(test.testId);
            console.log("Count: ", count);

            let format = await formatCountByPart(count);
            console.log("Format: ", format);

            let calTotal = await calculateTotals(format);
            console.log("calTotal: ", calTotal);


            let updateData = ({
                testId: test.testId,
                correctAnswer: cal.calAnswer.correctCount,
                skipAnswer: cal.calAnswer.skippedCount,
                countListenAnswer: calTotal.countListenAnswer,
                countReadAnswer: calTotal.countReadAnswer,
                totalQuestion: cal.calAnswer.totalQuestions
            });

            let res = await updateTest(updateData);
            resolve(res);

        } catch (e) {
            reject(e);
        }
    })
}

// tính tổng số câu theo phần listen và read
let calculateTotals = (countByPart) => {
    const listeningParts = ["Part 1", "Part 2", "Part 3", "Part 4"];
    const readingParts = ["Part 5", "Part 6", "Part 7"];

    let countListenAnswer = 0;
    let countReadAnswer = 0;

    // Sum counts for listening parts
    listeningParts.forEach(part => {
        if (countByPart[part]) {
            countListenAnswer += countByPart[part];
        }
    });

    // Sum counts for reading parts
    readingParts.forEach(part => {
        if (countByPart[part]) {
            countReadAnswer += countByPart[part];
        }
    });

    return {
        countListenAnswer,
        countReadAnswer
    };
}

// đếm số câu theo từng part
let countQuestionByPart = (testId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let test = await db.Test.findOne({
                where: { id: testId }
            })
            if (!test) {
                resolve({
                    errCode: 1,
                    errMessage: `The test isn't exist`
                })
            }
            let result = '';
            result = await db.Test_Result.findAll({
                where: {
                    testId: testId,
                },
                include: [
                    {
                        model: db.Question_And_Answer,
                        as: 'TestResult_QuestionData',
                        attributes: ['id'],
                        include: [
                            {
                                model: db.RL_And_QA,
                                as: 'RLQA_QuestionAndAnswerData',
                                attributes: ['id'],
                                include: [
                                    {
                                        model: db.Reading_And_Listening,
                                        as: 'RLQA_ReadAndListenData',
                                        attributes: ['id', 'questionType']
                                    }
                                ],

                            }
                        ]
                    }
                ]
            });
            resolve({
                errCode: 0,
                result,
                errMessage: `ok`
            })
        } catch (e) {
            reject(e);
        }
    })
}

// format lại giá trị của countQuestionByPart
let formatCountByPart = (data) => {
    const countByPart = {};

    data.result.forEach(item => {
        const questionType = item.TestResult_QuestionData.RLQA_QuestionAndAnswerData[0].RLQA_ReadAndListenData.questionType;
        countByPart[questionType] = (countByPart[questionType] || 0) + 1;
    });

    return countByPart;
}

// cập nhật lại test
let updateTest = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.testId) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                });
            }

            let test = await db.Test.findOne({
                where: { id: data.testId },
                // raw: false
            })
            if (!test) {
                resolve({
                    errCode: 1,
                    errMessage: `Test not found`
                });
            }

            test.correctAnswer = data.correctAnswer,
                test.skipAnswer = data.skipAnswer,
                test.countListenAnswer = data.countListenAnswer,
                test.countReadAnswer = data.countReadAnswer,
                test.totalQuestion = data.totalQuestion,
                await test.save();

            resolve({
                errCode: 0,
                errMessage: 'Update the test exam succeeds!'
            });
        } catch (e) {
            reject(e);
        }
    })
}

// hàm tính toán câu trả lời đúng, sai, bỏ qua
let calculateCorrectAnswer = (data) => {
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    data.tests.forEach(test => {
        if (test.stateAnswer === "CORRECT") {
            correctCount++;
        } else if (test.stateAnswer === "INCORRECT") {
            incorrectCount++;
        } else if (test.stateAnswer === "SKIP") {
            skippedCount++;
        }
    });

    const totalQuestions = data.tests.length;

    return {
        calAnswer: ({
            correctCount,
            incorrectCount,
            skippedCount,
            totalQuestions
        })
    };
}

// tạo test trả về id mới tạo của test
let createTest = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data === '') {
                resolve({
                    errCode: 1,
                    errMessage: 'Plz enter your information create test!'
                })
            } else {
                const currentDate = new Date().toISOString().split('T')[0];
                const testData = await db.Test.create({
                    examId: data.examId,
                    userId: data.userId,
                    correctAnswer: data.correctAnswer,
                    skipAnswer: data.skipAnswer,
                    countListenAnswer: data.countListenAnswer,
                    countReadAnswer: data.countReadAnswer,
                    totalQuestion: data.totalQuestion,
                    testTime: data.testTime,
                    testDate: currentDate,

                })
                resolve({
                    errCode: 0,
                    testId: testData.id,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

// hàm tạo 1 loạt đáp án vào test result
let bulkCreateTestResult = (testId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data === '') {
                resolve({
                    errCode: 1,
                    errMessage: 'Plz enter your information create test!'
                })
            } else {
                const tests = await db.Test_Result.bulkCreate(
                    data.map((test) => ({
                        questionId: test.questionId,
                        testId: testId,
                        answer: test.answer,
                        stateAnswer: test.stateAnswer,
                    }))
                );

                resolve({
                    errCode: 0,
                    tests,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    saveTestResult: saveTestResult,
    createTest: createTest,
    bulkCreateTestResult: bulkCreateTestResult,
    calculateCorrectAnswer: calculateCorrectAnswer,
    updateTest: updateTest,
    countQuestionByPart: countQuestionByPart,
    formatCountByPart: formatCountByPart,
    calculateTotals: calculateTotals,

}