import db from '../models/index';

let createComment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.contentComment === '') {
                resolve({
                    errCode: 1,
                    errMessage: 'Plz enter your comment!'
                })
            } else {
                const currentDate = new Date().toISOString().split('T')[0];
                const examData = await db.Comment.create({
                    examId: data.examId,
                    userId: data.userId,
                    parentCmtId: data.parentCmtId,
                    contentComment: data.contentComment,
                    cmtDate: currentDate,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    });
}

let getComment = (examId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const comments = await db.Comment.findAll({
                where: { examId: examId },
                include: [
                    {
                        model: db.User,
                        as: 'comment_UserData',
                        attributes: ['id', 'fullName', 'avatar']
                    }
                ],
                order: [['createdAt', 'DESC']],
            })

            resolve(comments)
        } catch (e) {
            reject(e);
        }
    });
}

let deleteComment = (commentId, currentId) => {
    return new Promise(async (resolve, reject) => {

        let comments = await db.Comment.findOne({
            where: {
                id: commentId,
                userId: currentId
            },
        })
        if (!comments) {
            resolve({
                errCode: 2,
                errMessage: `The comment isn't exist or user wrong`
            })
        }

        let flag = await db.Comment.findOne({
            where: {
                parentCmtId: commentId
            },
        })
        if (flag) {
            await db.Comment.destroy({
                where: {
                    parentCmtId: commentId
                }
            })
        }

        await db.Comment.destroy({
            where: {
                id: commentId
            }
        })
        resolve({
            errCode: 0,
            errMessage: `The comment is delete`
        })
    })
}

module.exports = {
    createComment: createComment,
    getComment: getComment,
    deleteComment: deleteComment,

}
