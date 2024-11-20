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

let handleGetAllTestResult = async (req, res) => {
    let userId = req.query.userId;
    if (!userId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            tests: []
        })
    }

    let tests = await testService.getAllTestResult(userId);
    return res.status(200).json({
        errCode: 0,
        errMessage: "ok",
        tests
    })
}

let handleUpdateCountUserTest = async (req, res) => {
    let examId = req.query.examId;
    if (!examId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            tests: []
        })
    }

    let tests = await testService.updateCountUserTest(examId);
    return res.status(200).json({
        errCode: 0,
        errMessage: "ok",
        tests
    })
}

let handleGetDetailTestResult = async (req, res) => {
    let testId = req.query.testId;
    if (!testId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            tests: []
        })
    }

    let tests = await testService.getDetailTestResult(testId);
    return res.status(200).json(tests);
}

let handleGetTitleExam = async (req, res) => {
    let testId = req.query.testId;
    if (!testId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            tests: []
        })
    }

    let tests = await testService.getTitleExam(testId);
    return res.status(200).json(tests);
}

let handleGetInfoStatistic = async (req, res) => {
    let { userId, type } = req.query;
    if (!userId || !type) {
        return res.status(500).json({
            errCode: 1,
            errMessage: "Missing required parameters",
        })
    }
    let info = await testService.getInfoStatistic(userId, type);
        return res.status(200).json({info});
}

module.exports = {
    handleSaveTestResult: handleSaveTestResult,
    handleGetTestResult: handleGetTestResult,
    handleUpdateCountUserTest: handleUpdateCountUserTest,
    handleGetDetailTestResult: handleGetDetailTestResult,
    handleGetAllTestResult: handleGetAllTestResult,
    handleGetTitleExam: handleGetTitleExam,
    handleGetInfoStatistic: handleGetInfoStatistic,

}