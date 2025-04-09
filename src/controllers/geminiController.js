import geminiService from "../services/geminiService";

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

let handleTranslateText = async (req, res) => {
    try {
        console.log("Request body:", req.body);

        let { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Thiếu nội dung đầu vào!",
            });
        }

        let response = await geminiService.translateText(prompt);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server!",
            details: error.message
        });
    }
};

const handleSituationText = async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ message: "Missing topic parameter" });
        }

        const situation = await geminiService.getSituation(topic);
        return res.status(200).json(situation);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const handleQuestionAndAnswer = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Missing text parameter" });
        }

        console.log("Received text:", text);

        const response = await geminiService.getQuestionAndAnswer(text);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const handleQuestionAndAnswer1 = async (req, res) => {
    try {
        const { text, situation, question } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Missing text parameter" });
        }

        console.log("Received text:", text);

        const response = await geminiService.getQuestionAndAnswer1(text, situation, question);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const judgeAnswerController = async (req, res) => {
    try {
        const { question, answer, situation } = req.body;

        const result = await geminiService.getJudgeAnswer(situation, question, answer);

        console.log("Kết quả trả về từ service:", result);

        return res.status(200).json(result);
    } catch (error) {
        console.error("Có lỗi xảy ra:", error.message);
        return res.status(500).json({ message: 'Có lỗi xảy ra khi đánh giá câu trả lời' });
    }
};

module.exports = {
    handleGetGeminiResponse: handleGetGeminiResponse,
    handleTranslateText: handleTranslateText,
    handleSituationText: handleSituationText,
    handleQuestionAndAnswer: handleQuestionAndAnswer,
    judgeAnswerController: judgeAnswerController,
    handleQuestionAndAnswer1: handleQuestionAndAnswer1
};
