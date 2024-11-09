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

// let handleEditFlashcard = async (req, res) => {
//     let message = await flashcardService.updateFlashcard(req.body);
//     console.log("flashcard update: ", message);
//     return res.status(200).json(message);
// }

// let handleDeleteFlashcard = async (req, res) => {
//     if (!req.body.id) {
//         return res.status(200).json({
//             errCode: 1,
//             errMessage: "Missing required parameters!"
//         })
//     }
//     let message = await flashcardService.deleteFlashcard(req.body.id);
//     console.log(message);
//     return res.status(200).json(message);
// }

// let handleSaveVocabularyToFlashcard = async (req, res) => {
//     const flashcardId = req.params.id; // flashcardId từ URL params
//     const vocabularyData = req.body; // dữ liệu từ vựng từ body

//     console.log('flashcardId:', flashcardId);
//     console.log('vocabularyData:', vocabularyData);

//     try {
//         const result = await flashcardService.saveVocabularyToFlashcard(flashcardId, vocabularyData);
//         return res.status(result.errCode === 0 ? 200 : 400).json(result);
//     } catch (error) {
//         console.error('Error saving vocabulary to flashcard:', error);
//         return res.status(500).json({ errCode: 1, errMessage: 'Lỗi hệ thống' });
//     }
// };

// let handleDeleteVocabFromFlashcard = async (req, res) => {
//     try {
//         let message = await flashcardService.deleteVocabFromFlashcard(req.body);
//         return res.status(200).json(message);
//     } catch (error) {
//         console.error("Error deleting vocabulary: ", error);
//         return res.status(500).json({ errCode: 1, message: "Server error" });
//     }
// }

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


module.exports = {
    handleGetAllFlashcard: handleGetAllFlashcard,
    handleGetAllFlashcardPagination: handleGetAllFlashcardPagination,
    handleCreateFlashcard: handleCreateFlashcard,
    handleSaveVocabOnFlashcard: handleSaveVocabOnFlashcard,
    handleGetVocabInFlashcardPagination: handleGetVocabInFlashcardPagination,
    // handleEditFlashcard: handleEditFlashcard,
    // handleDeleteFlashcard: handleDeleteFlashcard,
    // handleSaveVocabularyToFlashcard: handleSaveVocabularyToFlashcard,
    // handleDeleteVocabFromFlashcard: handleDeleteVocabFromFlashcard,

}
