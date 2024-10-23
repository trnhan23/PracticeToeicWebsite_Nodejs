import express from "express"
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import vocabularyController from '../controllers/vocabularyController';
import categoryExamController from '../controllers/categoryExamController';
import examController from '../controllers/examController';
import questionAndAnswer from '../controllers/questionAndAnswerController';
import cmtController from '../controllers/commentComtroller';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);

    //allcode
    router.get('/api/allcode', userController.getAllCode);

    //login
    router.post('/api/login', userController.handleLogin);

    //user
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-user', userController.handleCreateUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);

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

    // luyện thi
    router.get('/api/get-practice-exam', examController.handlePracticeExam);



    // question and answer
    router.post('/api/import-exam', questionAndAnswer.handleImportExam);

    // comment
    router.get('/api/get-comment', cmtController.handleGetComment);
    router.post('/api/create-comment', cmtController.handleCreateComment);
    router.delete('/api/delete-comment', cmtController.handleDeleteComment);

    return app.use("/", router);
}

module.exports = initWebRoutes;

