import questionAndAnswerService from '../services/questionAndAnswerService';

let handleImportExam = async (req, res) => {
    let message = await questionAndAnswerService.importFileExam(req.body);
    console.log("import file: ", message);
    return res.status(200).json(message);
}

module.exports = {
    handleImportExam: handleImportExam,

}