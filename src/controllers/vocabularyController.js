import vocabService from '../services/vocabularyService';
import axios from 'axios';

let getSearchVocabulary = async (req, res) => {

    const { word, language } = req.query;
    try {
        const response = await axios.get(`https://api.tracau.vn/WBBcwnwQpV89/s/${word}/${language}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching vocabulary:', error);
        res.status(500).json({ message: 'Error fetching vocabulary data' });
    }
}

let getAudioVocabulary = async (req, res) => {

    const { word } = req.query;
    try {
        const audioResponse = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const phonetics = audioResponse.data[0].phonetics;
        const usAudio = phonetics.find(p => p.audio && p.audio.includes('us'))?.audio;
        const ukAudio = phonetics.find(p => p.audio && p.audio.includes('uk'))?.audio;

        res.json({ audioUS: usAudio, audioUK: ukAudio });
    } catch (error) {
        console.error('Audio not found', error);
        res.status(500).json({ message: 'Error fetching audio data' });
    }
}

let handleGetAllVocabulary = async (req, res) => {
    let id = req.query.id;
    console.log("vocabulary: ", id);
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            vocabs: []
        })
    }

    let vocabs = await vocabService.getAllVocabularies(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: "ok",
        vocabs
    })
}

let handleCreateVocabulary = async (req, res) => {
    let message = await vocabService.createVocabulary(req.body);
    return res.status(200).json(message);
}

let handleEditVocabulary = async (req, res) => {
    let message = await vocabService.updateVocabulary(req.body);
    return res.status(200).json(message);
}

let handleDeleteVocabulary = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!"
        })
    }
    let message = await vocabService.deleteVocabulary(req.body.id);
    return res.status(200).json(message);
}

let handleCreateVocabularyInFlashcard = async (req, res) => {
    let message = await vocabService.createVocabularyInFlashcard(req.body);
    return res.status(200).json(message);
}

module.exports = {
    getSearchVocabulary: getSearchVocabulary,
    getAudioVocabulary: getAudioVocabulary,
    handleGetAllVocabulary: handleGetAllVocabulary,
    handleCreateVocabulary: handleCreateVocabulary,
    handleEditVocabulary: handleEditVocabulary,
    handleDeleteVocabulary: handleDeleteVocabulary,
    handleCreateVocabularyInFlashcard: handleCreateVocabularyInFlashcard,

}
