import flashcardService from '../services/flashcardService';

let handleGetAllFlashcard = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Missing userId",
            flashcards: [],
        });
    }

    try {
        let flashcards = await flashcardService.getAllFlashcard(userId);
        return res.status(200).json(flashcards);
    } catch (error) {
        return res.status(500).json({ errCode: 1, errMessage: 'Lỗi hệ thống' });
    }
};

let handleGetAllFlashcardPagination = async (req, res) => {
    const { userId, page } = req.query;

    if (!userId) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Missing userId",
            flashcards: [],
        });
    }

    try {
        let flashcards = await flashcardService.getAllFlashcardPagination(userId, page);
        return res.status(200).json(flashcards);
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        return res.status(500).json({ errCode: 1, errMessage: 'Lỗi hệ thống' });
    }
};

let handleCreateFlashcard = async (req, res) => {
    let message = await flashcardService.createFlashcard(req.body);
    return res.status(200).json(message);
}

let handleSaveVocabOnFlashcard = async (req, res) => {
    try {
        let message = await flashcardService.saveVocabFlashcard(req.body);
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json({ errCode: 1, message: "Server error" });
    }
}

let handleGetVocabInFlashcardPagination = async (req, res) => {
    const { flashcardId, page } = req.query;

    if (!flashcardId || !page) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Missing flashcardId",
            flashcards: [],
        });
    }
    let message = await flashcardService.getAllVocabInFlashcardPagination(flashcardId, page);
    return res.status(200).json(message);
}

let handleGetVocabInFlashcard = async (req, res) => {
    const { flashcardId } = req.query;

    if (!flashcardId) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Missing flashcardId",
            flashcards: [],
        });
    }
    let message = await flashcardService.getAllVocabInFlashcard(flashcardId);
    return res.status(200).json(message);
}

let handleDeleteFlashcard = async (req, res) => {
    let message = await flashcardService.deleteFlashcard(req.body);
    return res.status(200).json(message);
}

module.exports = {
    handleGetAllFlashcard: handleGetAllFlashcard,
    handleGetAllFlashcardPagination: handleGetAllFlashcardPagination,
    handleCreateFlashcard: handleCreateFlashcard,
    handleSaveVocabOnFlashcard: handleSaveVocabOnFlashcard,
    handleGetVocabInFlashcardPagination: handleGetVocabInFlashcardPagination,
    handleGetVocabInFlashcard: handleGetVocabInFlashcard,
    handleDeleteFlashcard: handleDeleteFlashcard,

}
