import db from '../models/index';

// const getAllFlashcard = async (userId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const flashcards = await db.Flashcard.findAll({
//                 where: { userId: userId },
//                 raw: true,
//             });

//             resolve({
//                 errCode: 0,
//                 flashcards,
//             });
//         } catch (error) {
//             console.error('Error fetching flashcards:', error);
//             reject({
//                 errCode: 1,
//                 errMessage: 'Lỗi hệ thống',
//             });
//         }
//     });
// };

const getAllFlashcard = async (userId, page) => {
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


// const saveVocabularyToFlashcard = async (flashcardId, vocabularyData) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let flashcard = await db.Flashcard.findOne({ where: { id: flashcardId } });
//             if (!flashcard) {
//                 return resolve({ errCode: 1, errMessage: "Flashcard không tồn tại" });
//             }

//             const [vocabulary, created] = await db.Vocabulary.findOrCreate({
//                 where: { word: vocabularyData.word },
//                 defaults: {
//                     definition: vocabularyData.definition,
//                     partOfSpeech: vocabularyData.partOfSpeech,
//                     exampleSentence: vocabularyData.exampleSentence,
//                     pronunciation: vocabularyData.pronunciation,
//                     image: vocabularyData.image,
//                     audioFileUK: vocabularyData.audioFileUK,
//                     audioFileUS: vocabularyData.audioFileUS,
//                 }
//             });

//             // Sử dụng đúng tên trường flashcardId và vocabularyId
//             await db.Flashcard_Vocabulary.create({
//                 flashcardId: flashcardId,
//                 vocabularyId: vocabulary.id, // Đảm bảo sử dụng vocabulary.id
//             });

//             resolve({
//                 errCode: 0,
//                 errMessage: 'Đã lưu từ vào flashcard thành công',
//             });
//         } catch (error) {
//             console.error('Lỗi khi lưu từ vào flashcard:', error);
//             reject({
//                 errCode: 1,
//                 errMessage: 'Lỗi hệ thống',
//             });
//         }
//     });
// };

// let createFlashcard = (data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             // Kiểm tra xem tiêu đề có được nhập không
//             if (data.flashcardName === '') {
//                 resolve({
//                     errCode: 1,
//                     errMessage: 'Plz enter your title!'
//                 });
//             } else {
//                 // Tạo flashcard mới trong cơ sở dữ liệu
//                 const newFlashcard = await db.Flashcard.create({
//                     userId: data.userId,
//                     flashcardName: data.flashcardName,
//                     description: data.description,
//                     amount: data.amount,
//                     isResetReview: data.isResetReview,
//                     countVocabularyViewed: data.countVocabularyViewed,
//                     countUserViewed: data.countUserViewed
//                 });

//                 // Trả về thông tin flashcard mới cùng với mã thành công
//                 resolve({
//                     errCode: 0,
//                     errMessage: 'ok',
//                     data: newFlashcard // Trả về dữ liệu flashcard mới
//                 });
//             }
//         } catch (e) {
//             reject(e);
//         }
//     });
// }

// let updateFlashcard = (data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!data.id) {
//                 resolve({
//                     errCode: 2,
//                     errMessage: 'Missing required parameters'
//                 });
//             }

//             let flashcard = await db.Flashcard.findOne({
//                 where: { id: data.id },
//                 // raw: false
//             })
//             console.log("Check flashcard: ", flashcard);
//             if (flashcard) {
//                 flashcard.userId = data.userId,
//                     flashcard.flashcardName = data.flashcardName,
//                     await flashcard.save();

//                 resolve({
//                     errCode: 0,
//                     errMessage: 'Update the flashcard succeeds!'
//                 });
//             } else {
//                 resolve({
//                     errCode: 1,
//                     errMessage: 'Flashcard not not found'
//                 });
//             }
//         } catch (e) {
//             reject(e);
//         }
//     })
// }

// let deleteFlashcard = (flashcardId) => {
//     return new Promise(async (resolve, reject) => {
//         let flashcard = await db.Flashcard.findOne({
//             where: { id: flashcardId }
//         })
//         if (!flashcard) {
//             resolve({
//                 errCode: 2,
//                 errMessage: 'Flashcard is not exist'
//             })
//         }
//         await db.Flashcard.destroy({
//             where: { id: flashcardId }
//         })
//         resolve({
//             errCode: 0,
//             errMessage: 'Flashcard is delete'
//         })
//     })
// }

// let deleteVocabFromFlashcard = (data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!data.flashcardId || !data.vocabularyId) {
//                 resolve({
//                     errCode: 1,
//                     errMessage: 'Missing required parameters!',
//                 });
//             } else {
//                 const result = await db.Flashcard_Vocabulary.destroy({
//                     where: {
//                         flashcardId: data.flashcardId,
//                         vocabularyId: data.vocabularyId,
//                     },
//                 });

//                 if (result) {
//                     resolve({
//                         errCode: 0,
//                         message: 'Vocabulary removed from flashcard successfully.',
//                     });
//                 } else {
//                     resolve({
//                         errCode: 2,
//                         message: 'Failed to remove vocabulary from flashcard.',
//                     });
//                 }
//             }
//         } catch (e) {
//             reject(e);
//         }
//     });
// }

let saveVocabFlashcard = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let saveVocab = await saveVocabulary(data);
            if (saveVocab.errCode === 0) {
                let saveVocab_Flashcard = await saveVocabFlash(saveVocab.id, data);
                if (saveVocab_Flashcard.errCode === 0) {
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
            if (data === "") {
                resolve({
                    errCode: 1,
                    errMessage: 'Error vocabulary!'
                })
            } else {
                const vocabData = await db.Vocabulary.create({
                    word: data.word,
                    definition: data.definition,
                    partOfSpeech: data.partOfSpeech,
                    exampleSentence: data.exampleSentence,
                    pronunciation: data.pronunciation,

                })
                resolve({
                    errCode: 0,
                    id: vocabData.id
                })
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    getAllFlashcard: getAllFlashcard,
    // createFlashcard: createFlashcard,
    // updateFlashcard: updateFlashcard,
    // deleteFlashcard: deleteFlashcard,
    // saveVocabularyToFlashcard: saveVocabularyToFlashcard,
    saveVocabFlashcard: saveVocabFlashcard,
    // saveVocabulary: saveVocabulary,
    // saveVocabFlash: saveVocabFlash,
    // deleteVocabFromFlashcard: deleteVocabFromFlashcard,

}