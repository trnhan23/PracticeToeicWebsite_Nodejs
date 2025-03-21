import db from '../models/index';

let getTopics = (topicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let topics = '';
            if (topicId === "ALL") {
                topics = await db.Topic.findAll({
                    attributes: {
                    },
                })
            }
            if (topicId && topicId !== 'ALL') {
                topics = await db.Topic.findOne({
                    where: { id: topicId },
                    attributes: {
                    },
                })
            }
            resolve(topics);
        } catch (e) {
            reject(e);
        }
    })
}

let deleteTopic = (topicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let topic = await db.Topic.findOne({
                where: { id: topicId }
            });

            if (!topic) {
                resolve({
                    errCode: 2,
                    errMessage: `Topic isn't exist`
                })
            }
            await db.Topic.destroy({
                where: { id: topicId }
            });

            resolve({
                errCode: 0,
                errMessage: `Topic deleted successfully`
            })
        } catch (e) {
            reject(e);
        }
    });
};



module.exports = {
    getTopics: getTopics,
    deleteTopic: deleteTopic,

}