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

module.exports = {
    handleGetTopics: handleGetTopics,

}
