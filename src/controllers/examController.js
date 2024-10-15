import examService from '../services/examService';


let handleGet8LatestExams = async (req, res) => {
    let message = await examService.get8LatestExams();
    return res.status(200).json(message);
}

let handleGetAllExam = async (req, res) => {

    let cateExamId = req.query.cateExamId;
    let page = req.query.page;
    let userId = req.query.userId;

    if (!userId || !cateExamId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            exams: []
        })
    }

    let exams = await examService.getAllExams(cateExamId, userId, page);
    return res.status(200).json({
        errCode: 0,
        errMessage: "ok",
        exams
    })
}

let handleCreateExam = async (req, res) => {
    let message = await examService.createExam(req.body);
    console.log("cate exam create: ", message);
    return res.status(200).json(message);
}

let handleEditExam = async (req, res) => {
    let message = await examService.updateExam(req.body);
    console.log("exam update: ", message);
    return res.status(200).json(message);
}

let handleDeleteExam = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!"
        })
    }
    let message = await examService.deleteExam(req.body.id);
    console.log(message);
    return res.status(200).json(message);
}

module.exports = {
    handleGet8LatestExams: handleGet8LatestExams,
    handleGetAllExam: handleGetAllExam,
    handleCreateExam: handleCreateExam,
    handleEditExam: handleEditExam,
    handleDeleteExam: handleDeleteExam,

}
