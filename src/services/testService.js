import db from '../models/index';
import { sequelize } from '../models/index';

let getDetailTestResult = (testId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!testId) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters',
                });
            }

            let test = await db.Test.findOne({
                where: { id: testId },
            });

            if (!test) {
                resolve({
                    errCode: 1,
                    errMessage: 'Test not found',
                });
            }

            let part = formatCountByPart(await countQuestionByPart(testId));
            let parts = getSortedParts(part);
            let listenAnswerCount = test.countListenAnswer || 0;
            let readAnswerCount = test.countReadAnswer || 0;

            let scoreListen = await getScore(listenAnswerCount) || { listenScore: 0 };
            let scoreRead = await getScore(readAnswerCount) || { readingScore: 0 };

            let listenScore = scoreListen.listenScore || 0;
            let readingScore = scoreRead.readingScore || 0;

            let totalScore = listenScore + readingScore;

            resolve({
                errCode: 0,
                errMessage: 'ok',
                tests: {
                    testId: test.id,
                    correctAnswer: test.correctAnswer || 0,
                    incorrectAnswer: test.totalQuestion - (test.correctAnswer + test.skipAnswer),
                    skipAnswer: test.skipAnswer || 0,
                    countListenAnswer: listenAnswerCount,
                    countReadAnswer: readAnswerCount,
                    listenScore: listenScore,
                    readingScore: readingScore,
                    totalQuestion: test.totalQuestion || 0,
                    score: totalScore,
                    testTime: test.testTime,
                    parts,
                },
            });
        } catch (e) {
            reject(e);
        }
    });
};

// lấy điểm
let getScore = (score) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!score) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                });
            }

            let scores = await db.Score.findOne({
                where: {
                    correctAnswer: score
                },
            })
            resolve(scores);
        } catch (e) {
            reject(e);
        }
    })
}

// sắp xếp part
let getSortedParts = (part) => {
    return Object.keys(part).sort((a, b) => {
        const partA = parseInt(a.replace("Part ", ""), 10);
        const partB = parseInt(b.replace("Part ", ""), 10);
        return partA - partB;
    });
}

// hàm lấy tất cả các test của người dùng theo examId và userId
let getTestResult = (examId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tests = await db.Test.findAll({
                where: {
                    examId: examId,
                    userId: userId
                },
                include: [
                    {
                        model: db.Test_Result,
                        as: 'TestResult_TestData',
                        attributes: ['id'],
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
                    }
                ],
                order: [['createdAt', 'DESC']],
            })

            resolve(tests)
        } catch (e) {
            reject(e);
        }
    })
}

// hàm lấy tất cả các test của người dùng theo eamId và userId
let getAllTestResult = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tests = await db.Test.findAll({
                where: {
                    userId: userId
                },
                include: [
                    {
                        model: db.Test_Result,
                        as: 'TestResult_TestData',
                        attributes: ['id'],
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
                    }
                ],
                order: [['createdAt', 'DESC']],
            })

            resolve(tests)
        } catch (e) {
            reject(e);
        }
    })
}

// lưu kết quả làm bài
let saveTestResult = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // tạo test
            let test = await createTest(data.test);
            // tạo 1 loạt test result
            console.log("Kiểm tra data: ", data);
            let testResult = await bulkCreateTestResult(test.testId, data.result.questions);

            // tính toán số câu làm đúng, sai, tổng
            let cal = await calculateCorrectAnswer(testResult);

            // tính tổng số câu theo phần listen and red
            let calTotal = await calculateTotals(data.result.correctCounts);
            // cập nhật +1 countUserTest
            await updateCountUserTest(data.test.examId);
            // cập nhật statusExam trong User_Exam
            await updateStatusExam(data.test.examId, data.test.userId);

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

// cập nhật statusExam trong User_Exam
let updateStatusExam = (examId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!examId || userId) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                });
            }

            let exam = await db.User_Exam.findOne({
                where: {
                    examId: examId,
                    userId: userId
                },
            })
            if (exam) {
                exam.statusExam = true,
                    await exam.save();
            } else {
                await db.User_Exam.create({
                    userId: userId,
                    examId: examId,
                    statusExam: true,
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Update the count user test succeeds!'
            });
        } catch (e) {
            reject(e);
        }
    })
}

// cập nhật countUserTest khi 1 người test
let updateCountUserTest = (examId) => {
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
                // raw: false
            })
            if (exam) {
                exam.countUserTest = exam.countUserTest + 1,
                    await exam.save();

                resolve({
                    errCode: 0,
                    errMessage: 'Update the count user test succeeds!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Error update count user test`
                });
            }
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
                // let res = await updateCountUserTest(data.examId);
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

let getTitleExam = (testId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tests = await db.Test.findAll({
                where: {
                    id: testId
                },
                attributes: ['id', 'examId', 'userId'],
                include: [
                    {
                        model: db.Exam,
                        as: 'Test_ExamData',
                        attributes: ['titleExam'],
                    }
                ],
                order: [['createdAt', 'DESC']],
            })
            resolve({
                errCode: 0,
                tests
            })
        } catch (e) {
            reject(e);
        }
    })
}

// đếm số lượng bài test của userId
let getCountTest = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter: userId',
                });
                return;
            }
            const tests = await db.Test.findAll({
                where: { userId },
                attributes: ['examId'],
                group: ['examId'],
                raw: true,
            });

            const count = tests.length;
            resolve({
                errCode: 0,
                count,
            });
        } catch (e) {
            console.error(e);
            reject({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    });
};

// lấy thời gian trung bình và tổng thời gian của userId
let getAverageTime = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter: userId',
                });
                return;
            }

            const result = await db.Test.findAll({
                where: { userId },
                attributes: [
                    [sequelize.fn('AVG', sequelize.col('testTime')), 'avgTestTime'],
                    [sequelize.fn('SUM', sequelize.col('testTime')), 'totalTestTime'],
                ],
                raw: true,
            });

            const avgTestTime = result[0]?.avgTestTime || 0;
            const totalTestTime = result[0]?.totalTestTime || 0;

            resolve({
                errCode: 0,
                avgTestTime: parseFloat(avgTestTime),
                totalTestTime: parseFloat(totalTestTime),
            });
        } catch (e) {
            console.error(e);
            reject({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    });
};

// lấy điểm cao nhất của phần listen và read của userId
let getMaxScoreAnswer = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter: userId',
                });
                return;
            }

            const result = await db.Test.findAll({
                where: { userId },
                attributes: [
                    [sequelize.fn('MAX', sequelize.col('countListenAnswer')), 'maxListenAnswer'],
                    [sequelize.fn('MAX', sequelize.col('countReadAnswer')), 'maxReadAnswer'],
                ],
                raw: true,
            });

            const maxListenAnswer = result[0]?.maxListenAnswer || 0;
            const maxReadAnswer = result[0]?.maxReadAnswer || 0;

            let scoreListen = await getScore(parseInt(maxListenAnswer)) || { listenScore: 0 };
            let scoreRead = await getScore(parseInt(maxReadAnswer)) || { readingScore: 0 };

            resolve({
                errCode: 0,
                maxListenAnswer: scoreListen.listenScore,
                maxReadAnswer: scoreRead.readingScore,
            });
        } catch (e) {
            reject({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    });
};

// tính điểm trung bình phần nghe và đọc của userId
let getAverageScore = async (userId) => {
    try {
        if (!userId) {
            return {
                errCode: 2,
                errMessage: 'Missing required parameters',
            };
        }

        let userTests = await db.Test.findAll({
            where: { userId: userId },
            attributes: ['countListenAnswer', 'countReadAnswer'],
        });

        if (!userTests || userTests.length === 0) {
            return {
                errCode: 1,
                errMessage: 'No tests found for the given userId',
            };
        }

        let totalListenScore = 0;
        let totalReadScore = 0;
        let totalTests = userTests.length;

        for (let test of userTests) {
            let listenScore = await getScore(test.countListenAnswer);
            let readScore = await getScore(test.countReadAnswer);

            totalListenScore += listenScore.listenScore || 0;
            totalReadScore += readScore.readingScore || 0;
        }

        let averageListenScore = totalListenScore / totalTests;
        let averageReadScore = totalReadScore / totalTests;

        return {
            errCode: 0,
            averageListenScore: averageListenScore.toFixed(2),
            averageReadScore: averageReadScore.toFixed(2),
        };
    } catch (error) {
        console.error(error);
        return {
            errCode: -1,
            errMessage: 'Error occurred while calculating average score',
        };
    }
};

// tính độ chính xác của userId
let calculateAccuracy = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter: userId',
                });
                return;
            }

            // Truy vấn tất cả các bản ghi có userId
            const result = await db.Test.findAll({
                where: { userId },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('countListenAnswer')), 'totalListenAnswer'],
                    [sequelize.fn('SUM', sequelize.col('countReadAnswer')), 'totalReadAnswer'],
                    [sequelize.fn('SUM', sequelize.col('totalQuestion')), 'totalQuestions'],
                ],
                raw: true,
            });

            // Lấy tổng giá trị các cột
            const totalListenAnswer = result[0]?.totalListenAnswer || 0;
            const totalReadAnswer = result[0]?.totalReadAnswer || 0;
            const totalQuestions = result[0]?.totalQuestions || 0;

            const totalAnswers = parseInt(totalListenAnswer) + parseInt(totalReadAnswer);
            const accuracy = totalQuestions > 0 ? (totalAnswers / totalQuestions) : 0;

            resolve({
                errCode: 0,
                accuracy: parseFloat(accuracy.toFixed(4)),
            });
        } catch (e) {
            console.error(e);
            reject({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    });
};

// lấy dữ liệu điểm và ngày để vẽ biểu đồ
let getTestScoresByDate = async (userId) => {
    try {
        if (!userId) {
            return {
                errCode: 2,
                errMessage: "Missing required parameters",
            };
        }

        let userTests = await db.Test.findAll({
            where: { userId: userId },
            attributes: ["testDate", "countListenAnswer", "countReadAnswer"],
            order: [["testDate", "ASC"]],
        });

        if (!userTests || userTests.length === 0) {
            return {
                errCode: 1,
                errMessage: "No tests found for the given userId",
            };
        }

        let listen = { labels: [], data: [] };
        let read = { labels: [], data: [] };

        for (let test of userTests) {
            const testDate = test.testDate;
            const listenScore = (await getScore(test.countListenAnswer)).listenScore || 0;
            const readScore = (await getScore(test.countReadAnswer)).readingScore || 0;

            const formattedDate = new Date(testDate).toLocaleDateString("en-GB");

            if (listenScore > 0) {
                listen.labels.push(formattedDate);
                listen.data.push(Number(listenScore));
            }

            if (readScore > 0) {
                read.labels.push(formattedDate);
                read.data.push(Number(readScore));
            }
        }

        return {
            errCode: 0,
            errMessage: "ok",
            listen,
            read,
        };
    } catch (error) {
        console.error(error);
        return {
            errCode: -1,
            errMessage: "Error occurred while fetching test scores",
        };
    }
};

let getInfoStatistic = async (userId, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter: userId',
                });
                return;
            }

            // lấy số lượng đề thi đã làm của người dùng
            const tests = await getCountTest(userId);
            if (tests.errCode !== 0) {
                reject(tests);
            }

            // lấy thời gian trung bình và tổng thời gian
            const times = await getAverageTime(userId);
            if (times.errCode !== 0) {
                reject(times);
            }

            const maxScore = await getMaxScoreAnswer(userId);
            if (maxScore.errCode !== 0) {
                reject(maxScore);
            }

            const calAcc = await calculateAccuracy(userId);
            if (calAcc.errCode !== 0) {
                reject(calAcc);
            }

            const score = await getAverageScore(userId);
            if (score.errCode !== 0) {
                reject(score);
            }

            const scoreByDate = await getTestScoresByDate(userId);
            if (scoreByDate.errCode !== 0) {
                reject(scoreByDate);
            }

            resolve({
                errCode: 0,
                errMessage: 'ok',
                info: {
                    countExamTested: tests.count,
                    avgTime: times.avgTestTime,
                    sumTime: times.totalTestTime,
                    maxListenAnswer: maxScore.maxListenAnswer,
                    maxReadAnswer: maxScore.maxReadAnswer,
                    accuracy: calAcc.accuracy,
                    averageListenScore: score.averageListenScore,
                    averageReadScore: score.averageReadScore,
                    scoreByDate
                }
            });

        } catch (e) {
            console.error(e);
            reject({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    });
};

module.exports = {
    saveTestResult: saveTestResult,
    createTest: createTest,
    bulkCreateTestResult: bulkCreateTestResult,
    calculateCorrectAnswer: calculateCorrectAnswer,
    updateTest: updateTest,
    countQuestionByPart: countQuestionByPart,
    formatCountByPart: formatCountByPart,
    calculateTotals: calculateTotals,
    getTestResult: getTestResult,
    updateCountUserTest: updateCountUserTest,
    updateStatusExam: updateStatusExam,
    getDetailTestResult: getDetailTestResult,
    getSortedParts: getSortedParts,
    getScore: getScore,
    getAllTestResult: getAllTestResult,
    getTitleExam: getTitleExam,
    getInfoStatistic: getInfoStatistic,

}