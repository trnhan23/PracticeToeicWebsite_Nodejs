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

module.exports = {
    createComment: createComment,
    getComment: getComment,

}
