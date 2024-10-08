import cateExamService from '../services/categoryExamService';


let handleGetAllCategoryExam = async (req, res) => {
    let id = req.query.id;
    console.log("cate-exam: ", id);
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            cateExams: []
        })
    }

    let cateExams = await cateExamService.getAllCateExams(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: "ok",
        cateExams
    })
}

// let handleCreateVocabulary = async (req, res) => {
//     let message = await vocabService.createVocabulary(req.body);
//     console.log("vocabulary create: ", message);
//     return res.status(200).json(message);
// }

// let handleEditVocabulary = async (req, res) => {
//     let message = await vocabService.updateVocabulary(req.body);
//     console.log("vocabulary update: ", message);
//     return res.status(200).json(message);
// }

// let handleDeleteVocabulary = async (req, res) => {
//     if (!req.body.id) {
//         return res.status(200).json({
//             errCode: 1,
//             errMessage: "Missing required parameters!"
//         })
//     }
//     let message = await vocabService.deleteVocabulary(req.body.id);
//     console.log(message);
//     return res.status(200).json(message);
// }

module.exports = {
    handleGetAllCategoryExam: handleGetAllCategoryExam,

}
