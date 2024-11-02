import testService from '../services/testService';

let handleSaveTestResult = async (req, res) => {
    let message = await testService.saveTestResult(req.body);
    return res.status(200).json(message); 
}

module.exports = {
    handleSaveTestResult: handleSaveTestResult,

}