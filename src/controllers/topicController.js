import topicService from '../services/topicService';

let handleGetTopics = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters"
            })
        }

        let topics = await topicService.getTopics(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "ok",
            topics
        })
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error From Server",
        })
    }
}

let handleDeleteTopic = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!"
        })
    }
    let message = await topicService.deleteTopic(req.body.id);
    return res.status(200).json(message);
}

let handleCreateTopic = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Missing required parameters!"
            });
        }
        let data = ({
            title: req.body.title,
            file: req.file
        })
        let message = await topicService.createTopic(data);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: "Server error!",
            errorDetail: e.message
        });
    }
};

let handleUpdateTopic = async (req, res) => {
    try {
        if (!req.body.id || !req.body.title) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Missing required parameters!"
            });
        }

        let data = {
            id: req.body.id,
            title: req.body.title,
            file: req.file || null
        };

        let message = await topicService.updateTopic(data);
        return res.status(200).json(message);

    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: "Server error!",
            errorDetail: e.message
        });
    }
};

module.exports = {
    handleGetTopics: handleGetTopics,
    handleDeleteTopic: handleDeleteTopic,
    handleCreateTopic: handleCreateTopic,
    handleUpdateTopic: handleUpdateTopic,

}
