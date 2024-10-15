import questionAndAnswerService from '../services/questionAndAnswerService';

let handleImportQuestionAndAnswer = async (req, res) => {
    let message = await questionAndAnswerService.importFileQuestionAndAnswer(req.body);
    console.log("import file: ", message);
    return res.status(200).json(message);
}

module.exports = {
    handleImportQuestionAndAnswer: handleImportQuestionAndAnswer,


}