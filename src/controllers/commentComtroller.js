import cmtService from '../services/commentService';


let handleCreateComment = async (req, res) => {
    let message = await cmtService.createComment(req.body);
    return res.status(200).json(message);
}

let handleGetComment = async (req, res) => {
    let examId = req.query.examId;
    let userId = req.query.userId;

    if (!userId || !examId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            cmts: []
        })
    }
    let message = await cmtService.getComment(examId, userId);
    return res.status(200).json(message);
}

let handleDeleteComment = async (req, res) => {
    if (!req.body.commentId || !req.body.currentId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!"
        })
    }
    let message = await cmtService.deleteComment(req.body.commentId, req.body.currentId);
    console.log(message);
    return res.status(200).json(message);
}

module.exports = {
    handleCreateComment: handleCreateComment,
    handleGetComment: handleGetComment,
    handleDeleteComment: handleDeleteComment,

}