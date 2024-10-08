import db from '../models/index';

let getAllVocabularies = (vocabId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let vocabs = '';
            if (vocabId === "ALL") {
                vocabs = await db.Vocabulary.findAll({
                    attributes: {
                        // exclude: ['password']
                    }
                })
            }
            if (vocabId && vocabId !== 'ALL') {
                vocabs = await db.Vocabulary.findOne({
                    where: { id: vocabId },
                    attributes: {
                        // exclude: ['password']
                    }
                })
            }
            resolve(vocabs);
        } catch (e) {
            reject(e);
        }
    })
}

let createVocabulary = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("check word: ", data.word);
            if (data.word === '') {
                resolve({
                    errCode: 1,
                    errMessage: 'Plz enter your word!'
                })
            } else {
                await db.Vocabulary.create({
                    word: data.word,
                    definition: data.definition,
                    partOfSpeech: data.partOfSpeech,
                    exampleSentence: data.exampleSentence,
                    pronunciation: data.pronunciation,
                    image: data.image,
                    audioFileUK: data.audioFileUK,
                    audioFileUS: data.audioFileUS,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    });
}

let updateVocabulary = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                });
            }

            let vocab = await db.Vocabulary.findOne({
                where: { id: data.id },
                // raw: false
            })
            console.log("Check vocab: ", vocab);
            if (vocab) {
                vocab.word = data.word,
                    vocab.definition = data.definition,
                    vocab.partOfSpeech = data.partOfSpeech,
                    vocab.exampleSentence = data.exampleSentence,
                    vocab.pronunciation = data.pronunciation,
                    vocab.image = data.image,
                    vocab.audioFileUK = data.audioFileUK,
                    vocab.audioFileUS = data.audioFileUS,
                    await vocab.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Update the vocabulary succeeds!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Vocabulary not not found`
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteVocabulary = (vocabId) => {
    return new Promise(async (resolve, reject) => {
        let vocab = await db.Vocabulary.findOne({
            where: { id: vocabId }
        })
        if (!vocab) {
            resolve({
                errCode: 2,
                errMessage: `The vocabulary isn't exist`
            })
        }
        await db.Vocabulary.destroy({
            where: { id: vocabId }
        })
        resolve({
            errCode: 0,
            errMessage: `The user is delete`
        })
    })
}

module.exports = {
    getAllVocabularies: getAllVocabularies,
    createVocabulary: createVocabulary,
    updateVocabulary: updateVocabulary,
    deleteVocabulary: deleteVocabulary,

}