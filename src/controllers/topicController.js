import topicService from '../services/topicService';

let handleGetAllTopics = async (req, res) => {
    try {
        let topics = await topicService.getAllTopics();
        console.log("Dữ liệu trả về từ topicService:", topics);

        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            topics: topics.data // ✅ Chỉ lấy mảng topics
        });
    } catch (error) {
        console.error("Error fetching topics: ", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server"
        });
    }
};



let handleCreateTopic = async (req, res) => {
    console.log("Headers:", req.headers);
    console.log("Received request body:", req.body); // Kiểm tra dữ liệu nhận được

    let { title, image } = req.body;

    if (!title || !image) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Missing required parameters!"
        });
    }

    let message = await topicService.createTopic({ title, image });
    return res.status(200).json(message);
};



let handleEditTopic = async (req, res) => {
    let { id, title, image } = req.body;

    if (!id || !title || !image) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Missing required parameters!"
        });
    }

    let message = await topicService.updateTopic({ id, title, image });
    return res.status(200).json(message);
};

let handleDeleteTopic = async (req, res) => {
    let { id } = req.body;

    if (!id) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Missing required parameters!"
        });
    }

    let message = await topicService.deleteTopic(id);
    return res.status(200).json(message);
};

module.exports = {
    handleGetAllTopics,
    handleCreateTopic,
    handleEditTopic,
    handleDeleteTopic
};
