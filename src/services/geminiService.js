require("dotenv").config();
import axios from "axios";

const API_URL = process.env.GEMINI_URL;
const API_KEY = process.env.GEMINI_API_KEY;

const getGeminiResponse = async (prompt) => {
    try {
        const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        return response.data.candidates[0]?.content?.parts[0]?.text || "Không có phản hồi từ API.";
    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message);
        return "Lỗi khi gọi API Gemini!";
    }
};

module.exports = {
    getGeminiResponse: getGeminiResponse,
};
