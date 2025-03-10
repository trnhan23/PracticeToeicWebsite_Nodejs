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

                let res = await updateCountComment(data.examId);
                if (res.errCode === 0) {
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                }
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

let updateCountComment = (examId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!examId) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                });
            }

            let exam = await db.Exam.findOne({
                where: { id: examId },
                // raw: false
            })
            if (exam) {
                exam.countComment = exam.countComment + 1,
                    await exam.save();

                resolve({
                    errCode: 0,
                    errMessage: 'Update the count user test succeeds!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Error update count user test`
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createComment: createComment,
    getComment: getComment,
    deleteComment: deleteComment,

}
