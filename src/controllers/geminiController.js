const geminiService = require("../services/geminiService");

let handleGetGeminiResponse = async (req, res) => {
    try {
        let { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Thiếu nội dung đầu vào!",
            });
        }

        let response = await geminiService.getGeminiResponse(prompt);
        return res.status(200).json({
            errCode: 0,
            errMessage: "Thành công!",
            response,
        });
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server!",
        });
    }
};

module.exports = {
    handleGetGeminiResponse: handleGetGeminiResponse,
};
