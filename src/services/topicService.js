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


module.exports = {
    getTopics: getTopics,

}