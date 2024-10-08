import examService from '../services/examService';


let handleGetAllExam = async (req, res) => {
    let id = req.query.id;
    console.log("cate-exam: ", id);
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            exams: []
        })
    }

    let exams = await examService.getAllExams(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: "ok",
        exams
    })
}

// let handleCreateExam = async (req, res) => {
//     let message = await examService.createExam(req.body);
//     console.log("cate exam create: ", message);
//     return res.status(200).json(message);
// }

// let handleEditExam = async (req, res) => {
//     let message = await examService.updateExam(req.body);
//     console.log("cate exam update: ", message);
//     return res.status(200).json(message);
// }

// let handleDeleteExam = async (req, res) => {
//     if (!req.body.id) {
//         return res.status(200).json({
//             errCode: 1,
//             errMessage: "Missing required parameters!"
//         })
//     }
//     let message = await examService.deleteExam(req.body.id);
//     console.log(message);
//     return res.status(200).json(message);
// }

module.exports = {
    handleGetAllExam: handleGetAllExam,
    handleCreateExam: handleCreateExam,
    handleEditExam: handleEditExam,
    handleDeleteExam: handleDeleteExam,

}
