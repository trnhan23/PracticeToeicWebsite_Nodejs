const db = require("../models"); // Import models

const TopicService = {
    // Lấy danh sách tất cả các topic
    getAllTopics: async () => {
        try {
            const topics = await db.Topic.findAll();
            return { success: true, data: topics };
        } catch (error) {
            console.error("Error fetching topics:", error);
            return { success: false, message: "Error fetching topics" };
        }
    },


    // Tạo một topic mới
    createTopic: async (data) => {
        try {
            console.log("Creating topic with data:", data);
            const newTopic = await db.Topic.create(data);
            return { success: true, data: newTopic };
        } catch (error) {
            console.error("Error creating topic:", error);
            return { success: false, message: "Error creating topic" };
        }
    },


    // Cập nhật topic theo ID
    updateTopic: async (id, data) => {
        try {
            const topic = await db.Topic.findByPk(id);
            if (!topic) {
                return { success: false, message: "Topic not found" };
            }
            await topic.update(data);
            return { success: true, data: topic };
        } catch (error) {
            console.error("Error updating topic:", error);
            return { success: false, message: "Error updating topic" };
        }
    },

    // Xóa topic theo ID
    deleteTopic: async (id) => {
        try {
            const topic = await db.Topic.findByPk(id);
            if (!topic) {
                return { success: false, message: "Topic not found" };
            }
            await topic.destroy();
            return { success: true, message: "Topic deleted successfully" };
        } catch (error) {
            console.error("Error deleting topic:", error);
            return { success: false, message: "Error deleting topic" };
        }
    },
};

module.exports = TopicService;
