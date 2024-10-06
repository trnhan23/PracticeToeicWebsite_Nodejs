import express from "express"
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import vocabularyController from '../controllers/vocabularyController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);

    //login
    router.post('/api/login', userController.handleLogin);
    
    //user
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-user', userController.handleCreateUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);

    //search vocabulary
    router.get('/api/search-vocabulary', vocabularyController.getSearchVocabulary);

    router.get('/api/allcode', userController.getAllCode);


    return app.use("/", router);
}

module.exports = initWebRoutes;

