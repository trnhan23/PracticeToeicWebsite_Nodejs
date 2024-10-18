import db from '../models/index';

let importFileQuestionAndAnswer = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !Array.isArray(data) || data.length === 0) {
                return resolve({
                    errCode: 1,
                    errMessage: 'No data'
                });
            }

            const result = await db.Question_And_Answer.bulkCreate(data);

            resolve({
                errCode: 0,
                errMessage: 'ok',
                addedRows: result.length
            });
        } catch (e) {
            reject(e);
        }
    });
};

let importFileExam = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !Array.isArray(data) || data.length === 0) {
                return resolve({
                    errCode: 1,
                    errMessage: 'No data'
                });
            }

            const readingAndListenings = [];
            const allQuestions = [];

            for (const item of data) {
                const readAndListenEntry = await db.Reading_And_Listening.create({
                    audioFile: item.audioFile,
                    images: item.images,
                    text: item.text,
                    questionType: item.questionType,
                    examId: item.examId
                });

                readingAndListenings.push(readAndListenEntry);

                const questions = await db.Question_And_Answer.bulkCreate(
                    item.questions.map((question) => ({
                        numberQuestion: question.numberQuestion,
                        questionText: question.questionText,
                        answerA: question.answerA,
                        answerB: question.answerB,
                        answerC: question.answerC,
                        answerD: question.answerD,
                        correctAnswer: question.correctAnswer
                    }))
                );

                // Add the questions of the current reading/listening to allQuestions
                allQuestions.push({
                    readAndListenEntry,
                    questions
                });
            }

            const rlAndQAData = [];
            allQuestions.forEach(({ readAndListenEntry, questions }) => {
                questions.forEach((question) => {
                    rlAndQAData.push({
                        readAndListenId: readAndListenEntry.id,
                        questionAndAnswerId: question.id
                    });
                });
            });

            await db.RL_And_QA.bulkCreate(rlAndQAData);

            resolve({
                errCode: 0,
                errMessage: 'ok'
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    importFileQuestionAndAnswer: importFileQuestionAndAnswer,
    importFileExam: importFileExam,
}