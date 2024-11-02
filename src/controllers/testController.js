import testService from '../services/testService';

let handleSaveTestResult = async (req, res) => {
    let message = await testService.saveTestResult(req.body);
    return res.status(200).json(message);
}

let handleGetTestResult = async (req, res) => {
    let examId = req.query.examId;
    let userId = req.query.userId;
    if (!examId || !userId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            tests: []
        })
    }

    let tests = await testService.getTestResult(examId, userId);
    return res.status(200).json({
        errCode: 0,
        errMessage: "ok",
        tests
    })
}

module.exports = {
    handleSaveTestResult: handleSaveTestResult,
    handleGetTestResult: handleGetTestResult,

}