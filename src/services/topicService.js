import db from '../models/index';
import uploadService from '../services/uploadService.js';

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

let createTopic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title) {
                return resolve({
                    errCode: 1,
                    errMessage: "Please enter a title!"
                });
            }

            if (!data.file) {
                return resolve({
                    errCode: 2,
                    errMessage: "Please upload an image!"
                });
            }
            const result = await uploadService.uploadFile(data.file);

            if (!result) {
                return reject({
                    errCode: 3,
                    errMessage: "Failed to upload image!"
                });
            }

            await db.Topic.create({
                title: data.title,
                image: result.secure_url
            });

            resolve({
                errCode: 0,
                errMessage: "Topic created successfully"
            });

        } catch (e) {
            reject(e);
        }
    });
};

let updateTopic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing topic ID!"
                });
            }

            let topic = await db.Topic.findOne({ where: { id: data.id } });

            if (!topic) {
                return resolve({
                    errCode: 2,
                    errMessage: "Topic not found!"
                });
            }

            let imageUrl = topic.image;

            if (data.file) {
                const result = await uploadService.uploadFile(data.file);
                if (!result) {
                    return reject({
                        errCode: 3,
                        errMessage: "Failed to upload image!"
                    });
                }
                imageUrl = result.secure_url;
            }

            await topic.update({
                title: data.title || topic.title,
                image: imageUrl
            });

            resolve({
                errCode: 0,
                errMessage: "Topic updated successfully"
            });

        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getTopics: getTopics,
    deleteTopic: deleteTopic,
    createTopic: createTopic,
    updateTopic: updateTopic,

}