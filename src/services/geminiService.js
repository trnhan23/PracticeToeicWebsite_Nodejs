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

const getGeminiChatbox = async (textUser) => {
    try {
        const prompt = `
            Bạn đóng vai trò là một trợ lý AI chuyên sâu về tiếng Anh trong một website học tiếng Anh.
            Nhiệm vụ của bạn là phản hồi các câu hỏi hoặc yêu cầu của người dùng bằng tiếng Việt, nhưng nội dung tập trung
            vào kiến thức tiếng Anh: từ vựng, ngữ pháp, giao tiếp, luyện nghe, đọc hiểu, mẹo thi cử, v.v.

            Nội dung phản hồi cần:
            - Giải thích rõ ràng, dễ hiểu.
            - Đưa ra ví dụ minh họa bằng tiếng Anh (có dịch tiếng Việt nếu cần).
            - Tập trung đúng yêu cầu người dùng đưa ra.
            - Trình bày ngắn gọn, súc tích nhưng vẫn đầy đủ ý.

            Câu hỏi của người dùng: "${textUser}"

            Lưu ý: Các phản hồi được đưa ra dưới dạng markdown.
        `;
        const response = await getGeminiResponse(prompt);
        return response;
    } catch (error) {
        console.error("Error in getGeminiChatbox:", error);
        return "Error connecting to Gemini API. Please try again later.";
    }
};

const countFluencyScore = async (text) => {
    try {
        const prompt = `
Bạn là chuyên gia đánh giá kỹ năng nói tiếng Anh. Tôi sẽ gửi một đoạn transcript.
Hãy chấm điểm độ lưu loát trên thang 100 dựa trên:
- Từ đệm (uh, um, you know,...)
- Lặp từ
- Độ dài câu
- Vốn từ

Sau đó, hãy viết một nhận xét ngắn (1-2 câu) nêu lỗi chính và gợi ý cải thiện.

Transcript: "${text}"

❗ Chỉ trả về JSON, không thêm chú thích:
{
  "score": 85,
  "comment": "Bạn sử dụng nhiều từ đệm và lặp từ. Cần luyện nói trôi chảy và dùng từ phong phú hơn."
}
        `.trim();

        // Gọi hàm `getGeminiResponse` để lấy phản hồi từ Gemini
        const response = await getGeminiResponse(prompt);

        if (response) {
            try {
                // Loại bỏ các dấu backtick (```json, ``` và những dòng mới nếu có)
                const cleanedResponse = response.replace(/^```json|\n?```$/g, '').trim();

                // Kiểm tra lại nếu phản hồi có chứa các ký tự không hợp lệ
                const sanitizedResponse = cleanedResponse.replace(/`/g, ''); // Loại bỏ dấu backtick nếu có

                // Parse JSON response
                const parsed = JSON.parse(sanitizedResponse);

                return {
                    score: Math.max(0, Math.min(100, Math.round(parsed.score))),
                    comment: parsed.comment || "Không có nhận xét."
                };
            } catch (err) {
                console.error("Lỗi khi parse JSON từ Gemini:", err.message);
                console.log("Nội dung phản hồi:", response);
                return {
                    score: 0,
                    comment: "Phản hồi từ Gemini không hợp lệ. Vui lòng thử lại."
                };
            }
        }

        return {
            score: 0,
            comment: "Không nhận được phản hồi từ Gemini API"
        };
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API:", error.message);
        return {
            score: 0,
            comment: "Đã xảy ra lỗi khi đánh giá. Vui lòng thử lại sau."
        };
    }
};

const getSuggestedAnswer = async (situation, question) => {
    try {
        const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
            contents: [{
                role: "user",
                parts: [{
                    text: `You are a highly reliable assistant specialized in generating correct answers based on the given situation and question.

                    INSTRUCTIONS:
                    - Carefully analyze the provided situation and question.
                    - ONLY generate an answer directly relevant to the given situation and question.
                    - Do NOT generate unrelated information or introduce content outside of the provided context.
                    - If you do not have enough information to answer, politely state that you need more details.
                    - Use simple, clear, and easy-to-understand English suitable for customer conversations.
                    - Provide helpful steps, guidance, or suggestions whenever possible.
                    - Avoid vague or generic responses. Always be practical and actionable.

                    INPUT:
                    Situation: "${situation}"
                    Question: "${question}"

                    OUTPUT FORMAT:
                    Suggested Answer: <Your answer here>`
                }]
            }]
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        const candidate = response.data.candidates?.[0];
        const aiResponse = candidate?.content?.parts?.[0]?.text || "";

        // Parse kết quả
        const match = aiResponse.match(/Suggested Answer:\s*(.*)/i);
        const suggestedAnswer = match ? match[1].trim() : "No valid answer received.";

        return suggestedAnswer;

    } catch (error) {
        throw new Error('API request failed: ' + error);
    }
};


module.exports = {
    getGeminiResponse: getGeminiResponse,
    translateText: translateText,
    getSituation: getSituation,
    getQuestionAndAnswer: getQuestionAndAnswer,
    getQuestionAndAnswer1: getQuestionAndAnswer1,
    getJudgeAnswer: getJudgeAnswer,
    getGeminiChatbox: getGeminiChatbox,
    countFluencyScore: countFluencyScore,
    getSuggestedAnswer: getSuggestedAnswer

};
