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

const translateText = async (text) => {
    try {
        const prompt = `Translate this English text to Vietnamese and return only the translated text without any extra words:\n"${text}"`;
        const response = await getGeminiResponse(prompt);

        if (response) {
            return {
                errCode: 0,
                text: response.trim()
            };
        }
        return {
            errCode: 1,
            errMessage: 'Không nhận được phản hồi từ Gemini API'
        };
    } catch (error) {
        return {
            errCode: 1,
            errMessage: 'Lỗi khi gọi Gemini API',
            details: error.message
        };
    }
};

const getSituation = async (topic) => {
    try {
        const prompt = `Create a very simple and short real-life situation in English related to the topic: "${topic}". The situation should be in the format: 
        
        "<mô tả ngắn gọn về tình huống thực tế tầm 2-3 dòng>". 
        Do not include any extra details or explanations.`;

        const response = await getGeminiResponse(prompt);

        return { situation: response };
    } catch (error) {
        console.error("Error in getSituation:", error);
        return { situation: "Error connecting to Gemini API. Please try again later." };
    }
};

const getQuestionAndAnswer = async (text) => {
    try {
        let prompt = "";
        const isQuestion = text.trim().endsWith("?");

        if (isQuestion) {
            // Nếu input là câu hỏi => Trả lời ngắn gọn và đặt câu hỏi liên quan chặt chẽ
            prompt = `Answer the following question briefly (1-2 sentences) and generate a relevant follow-up question that keeps the conversation flowing naturally:\n\n"${text}"\n`;
        } else {
            // Nếu input là câu trả lời => Đặt một câu hỏi tiếp theo có liên quan trực tiếp
            prompt = `Based on the following statement, generate a single concise follow-up question that deepens the discussion:\n\n"${text}"\n`;
        }

        const response = await getGeminiResponse(prompt);

        // Xử lý response để loại bỏ các phần không cần thiết
        const lines = response
            .replace(/Follow-up:\s*/gi, "") // Xóa chữ "Follow-up:" nếu có
            .split("\n")
            .map(line => line.trim())
            .filter(line => line);

        let result = "";

        if (isQuestion) {
            // Nếu input là câu hỏi: Lấy dòng đầu tiên làm câu trả lời, dòng thứ hai làm câu hỏi tiếp theo
            const answer = lines[0] || "I'm not sure.";
            const followUpQuestion = lines[1] || "What do you think about this?";
            result = `${answer} ${followUpQuestion}`;
        } else {
            // Nếu input là câu trả lời: Lấy toàn bộ response làm câu hỏi tiếp theo
            result = lines[0] || "Can you elaborate on that?";
        }

        return { result };
    } catch (error) {
        console.error("Error in getQuestionAndAnswer:", error);
        return { error: "Error connecting to Gemini API. Please try again later." };
    }
};

const getQuestionAndAnswer1 = async (text, situation, question) => {
    try {
        let prompt = "";
        const isQuestion = text.trim().endsWith("?");

        if (isQuestion) {
            prompt = `
                Given the following situation: "${situation}"
                And the previous question: "${question}"
                Please follow this instruction:
                Answer the following question briefly (1-2 sentences) and ask a follow-up question that is relevant and helps continue the conversation naturally. 
                (Both the answer and follow-up question must be appropriate to the situation above):
                "${text}"
            `.trim();
        } else {
            prompt = `
                Based on the answer: "${text}"
                Given the situation: "${situation}"
                And the previous question: "${question}"
                Check whether the answer is appropriate to the situation and question.
                    If yes, generate a short follow-up question to deepen the discussion. (Only output the question content, do not include any extra phrases such as: Yes, the answer is appropriate, Yes, ...).
                    If not, provide a brief suggestion (1–2 sentences) on how to answer better in this context, then ask a relevant follow-up question to help the conversation flow naturally. (Combine the suggestion and follow-up question into a single paragraph, and only include the required content — no extra introductory words or formatting.)
                (Both your answer and question must align with the situation above.)
            `.trim();
        }

        const response = await getGeminiResponse(prompt);

        const lines = response
            .replace(/Follow-up:\s*/gi, "")
            .split("\n")
            .map(line => line.trim())
            .filter(line => line);

        let result = "";

        if (isQuestion) {
            const answer = lines[0] || "I'm not sure.";
            const followUpQuestion = lines[1] || "What are your thoughts on this?";
            result = `${answer} ${followUpQuestion}`;
        } else {
            result = lines.join(" ") || "Can you clarify your response further?";
        }

        return { result };
    } catch (error) {
        console.error("Error in getQuestionAndAnswer:", error);
        return { error: "Error connecting to Gemini API. Please try again later." };
    }
};

const getJudgeAnswer = async (situation, question, answer) => {
    try {
        const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
            contents: [{
                role: "user",
                parts: [{
                    text: `Đánh giá câu trả lời theo các tiêu chí sau hoàn toàn bằng Tiếng Việt với tình huống, câu hỏi và câu trả lời được đauw ra:
                    - Score: Chấm điểm từ 0-100 (Chấm điểm chi tiết giúp tôi).
                    - Grammar Correct: Nhận xét chi tiết về ngữ pháp của câu trả lời.
                    - Context Correct: Nhận xét chi tiết về sự phù hợp với câu hỏi.
                    - Đề xuất một câu trả lời hay hơn nếu có.

                    Tình huống: "${situation}"
                    Câu hỏi: "${question}"
                    Câu trả lời: "${answer}"

                    Trả về kết quả dưới dạng:
                    Alternative Answer: <câu trả lời tốt hơn hoặc N/A nếu không có>
                    Score: <điểm từ 0-100>
                    Grammar Feedback: <nhận xét về ngữ pháp>
                    Context Feedback: <nhận xét về mức độ liên quan>`
                }]
            }]
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log('Kết quả trả về từ API:', JSON.stringify(response.data, null, 2));

        const candidate = response.data.candidates?.[0];

        if (!candidate || !candidate.content || !candidate.content.parts) {
            throw new Error("API không trả về dữ liệu mong muốn.");
        }

        // Trích xuất nội dung trả về
        const aiResponse = candidate.content.parts?.[0]?.text || "";

        console.log("Dữ liệu AI trả về:", aiResponse);

        // Xử lý kết quả để lấy thông tin mong muốn
        const parsedData = aiResponse.split("\n").reduce((acc, line) => {
            if (line.startsWith("Alternative Answer:")) {
                acc.hasAlternativeAnswer = line.replace("Alternative Answer:", "").trim();
            } else if (line.startsWith("Score:")) {
                acc.score = parseFloat(line.replace("Score:", "").trim());
            } else if (line.startsWith("Grammar Feedback:")) {
                acc.grammarCorrect = line.replace("Grammar Feedback:", "").trim();
            } else if (line.startsWith("Context Feedback:")) {
                acc.contextCorrect = line.replace("Context Feedback:", "").trim();
            }
            return acc;
        }, {});

        return {
            hasAlternativeAnswer: parsedData.hasAlternativeAnswer || "N/A",
            score: parsedData.score || 0,
            grammarCorrect: parsedData.grammarCorrect || "Không có nhận xét.",
            contextCorrect: parsedData.contextCorrect || "Không có nhận xét."
        };

    } catch (error) {
        throw new Error('Không thể kết nối với API');
    }
};

module.exports = {
    getGeminiResponse: getGeminiResponse,
    translateText: translateText,
    getSituation: getSituation,
    getQuestionAndAnswer: getQuestionAndAnswer,
    getQuestionAndAnswer1: getQuestionAndAnswer1,
    getJudgeAnswer: getJudgeAnswer
};
