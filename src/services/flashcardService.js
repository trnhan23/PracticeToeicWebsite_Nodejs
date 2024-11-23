import db from '../models/index';

const getAllFlashcard = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const flashcards = await db.Flashcard.findAll({
                where: { userId: userId },
                raw: true,
            });

            resolve({
                errCode: 0,
                flashcards,
            });
        } catch (error) {
            console.error('Error fetching flashcards:', error);
            reject({
                errCode: 1,
                errMessage: 'Lỗi hệ thống',
            });
        }
    });
};

const getAllFlashcardPagination = async (userId, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            const limit = 8;
            const offset = (page - 1) * limit;

            const result = await db.Flashcard.findAndCountAll({
                where: { userId: userId },
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']],
                raw: true,
            });

            const flashcards = result.rows;
            const totalCount = result.count;

            resolve({
                errCode: 0,
                flashcards: flashcards,
                totalCount: totalCount
            });

        } catch (error) {
            console.error('Error fetching flashcards:', error);
            reject({
                errCode: 1,
                errMessage: 'Lỗi hệ thống',
            });
        }
    });
};

let createFlashcard = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.flashcardName === '') {
                resolve({
                    errCode: 1,
                    errMessage: 'Plz enter your title!'
                });
            } else {
                const newFlashcard = await db.Flashcard.create({
                    userId: data.userId,
                    flashcardName: data.flashcardName,
                    description: data.description,
                    amount: 0,
                    isResetReview: false,
                    countVocabularyViewed: 0,
                    countUserViewed: 0
                });

                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    flashcards: newFlashcard
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

// hàm chính lưu vocab vào flashcard bên search word
let saveVocabFlashcard = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let saveVocab = await saveVocabulary(data);
            if (saveVocab.errCode === 0) {
                let saveVocab_Flashcard = await saveVocabFlash(saveVocab.id, data);
                if (saveVocab_Flashcard.errCode === 0) {
                    await updateAmountOfFlashcard(data.flashcardId);
                    resolve({ errCode: 0, message: 'Vocabulary saved to flashcard successfully.' });
                } else {
                    resolve({ errCode: 1, message: 'Failed to save vocabulary to flashcard.' });
                }
            } else {
                resolve({ errCode: 1, message: 'Error saving vocabulary!' });
            }
        } catch (e) {
            reject(e);
        }
    });
}

let saveVocabFlash = (vocabularyId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data === "") {
                resolve({
                    errCode: 1,
                    errMessage: 'Error vocabulary!'
                })
            } else {
                const vocab_flashcardData = await db.Flashcard_Vocabulary.create({
                    flashcardId: data.flashcardId,
                    vocabularyId: vocabularyId,
                    isReview: false,
                })
                resolve({
                    errCode: 0,
                    message: 'ok',
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let saveVocabulary = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || data.word === "") {
                resolve({
                    errCode: 1,
                    errMessage: 'Error vocabulary!'
                });
            } else {
                let vocabData = await db.Vocabulary.findOne({
                    where: { word: data.word },
                });

                if (vocabData) {
                    resolve({
                        errCode: 0,
                        id: vocabData.id
                    });

                } else {
                    vocabData = await db.Vocabulary.create({
                        word: data.word,
                        definition: data.definition,
                        partOfSpeech: data.partOfSpeech,
                        exampleSentence: data.exampleSentence,
                        pronunciation: data.pronunciation,
                    });
                    resolve({
                        errCode: 0,
                        id: vocabData.id
                    });
                }
            }
        } catch (e) {
            console.error("Error saving vocabulary:", e);
            reject(e);
        }
    });
};

// lấy vocab theo flashcard theo pagination
const getAllVocabInFlashcardPagination = async (flashcardId, page) => {
    try {
        const limit = 8;
        const offset = (page - 1) * limit;

        const flashcard = await db.Flashcard.findOne({
            where: { id: flashcardId },
            attributes: ['id', 'userId', 'flashcardName', 'description', 'amount', 'createdAt'],
            raw: true
        });

        if (!flashcard) {
            return {
                errCode: 1,
                errMessage: 'Flashcard not found',
            };
        }

        const vocabData = await db.Vocabulary.findAndCountAll({
            include: [
                {
                    model: db.Flashcard_Vocabulary,
                    as: 'FV_VocabularyData',
                    where: { flashcardId },
                    attributes: []
                }
            ],
            attributes: ['id', 'word', 'definition', 'partOfSpeech', 'exampleSentence', 'pronunciation', 'createdAt'],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            raw: true
        });

        const flashcardWithVocab = {
            ...flashcard,
            vocabularies: vocabData.rows
        };

        return {
            errCode: 0,
            flashcard: flashcardWithVocab,
            totalCount: vocabData.count
        };

    } catch (error) {
        console.error('Error fetching vocabulary for flashcard:', error);
        return {
            errCode: 1,
            errMessage: 'Lỗi hệ thống',
        };
    }
};

const getAllVocabInFlashcard = async (flashcardId) => {
    try {
        const flashcard = await db.Flashcard.findOne({
            where: { id: flashcardId },
            attributes: ['id', 'userId', 'flashcardName', 'description', 'amount', 'createdAt'],
            raw: true
        });

        if (!flashcard) {
            return {
                errCode: 1,
                errMessage: 'Flashcard not found',
            };
        }
        const vocabData = await db.Vocabulary.findAll({
            include: [
                {
                    model: db.Flashcard_Vocabulary,
                    as: 'FV_VocabularyData',
                    where: { flashcardId },
                    attributes: []
                }
            ],
            attributes: ['id', 'word', 'definition', 'partOfSpeech', 'exampleSentence', 'pronunciation', 'createdAt'],
            order: [['createdAt', 'DESC']],
            raw: true
        });

        const flashcardWithVocab = {
            ...flashcard,
            vocabularies: vocabData
        };

        return {
            errCode: 0,
            flashcard: flashcardWithVocab
        };

    } catch (error) {
        console.error('Error fetching vocabulary for flashcard:', error);
        return {
            errCode: 1,
            errMessage: 'Lỗi hệ thống',
        };
    }
};

// cập nhật amount cho flashcard
let updateAmountOfFlashcard = (flashcardId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!flashcardId) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                });
            }

            let flashcard = await db.Flashcard.findOne({
                where: { id: flashcardId },
                // raw: false
            })
            if (flashcard) {
                flashcard.amount = flashcard.amount + 1,
                    await flashcard.save();

                resolve({
                    errCode: 0,
                    errMessage: 'Update the amount flashcard succeeds!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Error update amount flashcard`
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteFlashcard = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let flashcard = await db.Flashcard.findOne({
                where: {id: data.id},
            })
            if (!flashcard) {
                resolve({
                    errCode: 2,
                    errMessage: `Flashcard không tồn tại`
                })
            }
            await db.Flashcard.destroy({
                where: {id: data.id},
            })

            await db.Flashcard_Vocabulary.destroy({
                where: {flashcardId: data.id},
            })

            resolve({
                errCode: 0,
                errMessage: "ok"
            })
        } catch(e){
            reject({
                errCode: -1,
                errMessage: e
            })
        }
    })
}

module.exports = {
    getAllFlashcard: getAllFlashcard,
    getAllFlashcardPagination: getAllFlashcardPagination,
    createFlashcard: createFlashcard,
    saveVocabFlashcard: saveVocabFlashcard,
    getAllVocabInFlashcardPagination: getAllVocabInFlashcardPagination,
    updateAmountOfFlashcard: updateAmountOfFlashcard,
    getAllVocabInFlashcard: getAllVocabInFlashcard,
    deleteFlashcard: deleteFlashcard,
    // updateFlashcard: updateFlashcard,
    // saveVocabulary: saveVocabulary,
    // saveVocabFlash: saveVocabFlash,
    // deleteVocabFromFlashcard: deleteVocabFromFlashcard,

}