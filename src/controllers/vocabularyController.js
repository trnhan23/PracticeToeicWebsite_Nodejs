import userService from '../services/vocabularyService';
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

module.exports = {
    getSearchVocabulary: getSearchVocabulary,

}
