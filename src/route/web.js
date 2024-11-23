import express from "express";
import upload from '../config/multerConfig';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import vocabularyController from '../controllers/vocabularyController';
import categoryExamController from '../controllers/categoryExamController';
import examController from '../controllers/examController';
import questionAndAnswer from '../controllers/questionAndAnswerController';
import cmtController from '../controllers/commentComtroller';
import testController from '../controllers/testController';
import flashcardController from '../controllers/flashcardController';
import uploadController from '../controllers/uploadController';
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);

    //allcode
    router.get('/api/allcode', userController.getAllCode);

    //upload file (image, mp3) to cloud
    router.post('/api/upload', upload.single('file'), uploadController.handleUploadFileToCloud);

    //login
    router.post('/api/login', userController.handleLogin);

    //user
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-user', userController.handleCreateUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.post('/api/verify-account-user', userController.handleVerifyAccountUser);
    router.post('/api/send-code', userController.handleSendCode);
    router.post('/api/check-send-code', userController.handleCheckSendCode);
    //search vocabulary
    router.get('/api/search-vocabulary', vocabularyController.getSearchVocabulary);

    //get audio vocabulary
    router.get('/api/audio-vocabulary', vocabularyController.getAudioVocabulary);

    // crud vocabulary
    router.get('/api/get-all-vocabulary', vocabularyController.handleGetAllVocabulary);
    router.post('/api/create-vocabulary', vocabularyController.handleCreateVocabulary);
    router.put('/api/edit-vocabulary', vocabularyController.handleEditVocabulary);
    router.delete('/api/delete-vocabulary', vocabularyController.handleDeleteVocabulary);

    // category exam (danh mục các năm)
    router.get('/api/get-all-category-exam', categoryExamController.handleGetAllCategoryExam);
    router.post('/api/create-category-exam', categoryExamController.handleCreateCategoryExam);
    router.put('/api/edit-category-exam', categoryExamController.handleEditCategoryExam);
    router.delete('/api/delete-category-exam', categoryExamController.handleDeleteCategoryExam);

    // exam (các bài thi)
    router.get('/api/get-latest-exam', examController.handleGet8LatestExams);
    router.get('/api/get-all-exam', examController.handleGetAllExam);
    router.post('/api/create-exam', examController.handleCreateExam);
    router.put('/api/edit-exam', examController.handleEditExam);
    router.delete('/api/delete-exam', examController.handleDeleteExam);
    router.get('/api/get-exam', examController.handleGetExam);


    // luyện thi
    router.get('/api/get-practice-exam', examController.handlePracticeExam);
    router.get('/api/get-answer-exam', examController.handleGetAnswerExam);
    router.get('/api/get-answer-by-part', examController.handleGetAnswerByPart);

    // question and answer
    router.post('/api/import-exam', questionAndAnswer.handleImportExam);

    // comment
    router.get('/api/get-comment', cmtController.handleGetComment);
    router.post('/api/create-comment', cmtController.handleCreateComment);
    router.delete('/api/delete-comment', cmtController.handleDeleteComment);

    // test - test result
    router.get('/api/get-test-result', testController.handleGetTestResult);
    router.get('/api/get-all-test-result', testController.handleGetAllTestResult);
    router.get('/api/get-detail-test-result', testController.handleGetDetailTestResult);
    router.post('/api/save-test-result', testController.handleSaveTestResult);
    router.get('/api/get-title-exam', testController.handleGetTitleExam);

    router.get('/api/get-info-statistic', testController.handleGetInfoStatistic);
    
    // update countUserTest
    router.get('/api/update-count-user-test', testController.handleUpdateCountUserTest);

    //flashcard - vocabulary-flashcard
    router.get('/api/get-all-flashcard-pagination', flashcardController.handleGetAllFlashcardPagination);
    router.get('/api/get-all-flashcard', flashcardController.handleGetAllFlashcard);
    router.post('/api/create-flashcard', flashcardController.handleCreateFlashcard);
    router.delete('/api/delete-flashcard', flashcardController.handleDeleteFlashcard);

    //router.put('/api/edit-flashcard', flashcardController.handleEditFlashcard);

    router.post('/api/save-vocab-flashcard', flashcardController.handleSaveVocabOnFlashcard);
    router.get('/api/get-vocab-in-flashcard-pagination', flashcardController.handleGetVocabInFlashcardPagination);
    router.get('/api/get-vocab-in-flashcard', flashcardController.handleGetVocabInFlashcard);
    //router.delete('/api/delete-vocab-flashcard', flashcardController.handleDeleteVocabFromFlashcard);





    return app.use("/", router);
}

module.exports = initWebRoutes;

