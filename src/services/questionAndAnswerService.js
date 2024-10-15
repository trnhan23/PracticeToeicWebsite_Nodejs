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


module.exports = {
    importFileQuestionAndAnswer: importFileQuestionAndAnswer,


}