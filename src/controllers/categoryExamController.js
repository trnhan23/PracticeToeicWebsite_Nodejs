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

let handleCreateCategoryExam = async (req, res) => {
    let message = await cateExamService.createCateExam(req.body);
    console.log("cate exam create: ", message);
    return res.status(200).json(message);
}

let handleEditCategoryExam = async (req, res) => {
    let message = await cateExamService.updateCateExam(req.body);
    console.log("cate exam update: ", message);
    return res.status(200).json(message);
}

let handleDeleteCategoryExam = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!"
        })
    }
    let message = await cateExamService.deleteCateExam(req.body.id);
    console.log(message);
    return res.status(200).json(message);
}

module.exports = {
    handleGetAllCategoryExam: handleGetAllCategoryExam,
    handleCreateCategoryExam: handleCreateCategoryExam,
    handleEditCategoryExam: handleEditCategoryExam,
    handleDeleteCategoryExam: handleDeleteCategoryExam,

}
