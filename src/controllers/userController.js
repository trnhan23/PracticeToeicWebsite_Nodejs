import userService from '../services/userService';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }

    let userData = await userService.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    // let id = req.body.id;
    let id = req.query.id;
    console.log("user: ", id);
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            users: []
        })
    }

    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: "ok",
        users
    })
}

let handleCreateUser = async (req, res) => {
    let message = await userService.createUser(req.body);
    console.log(message);
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUser(data);
    return res.status(200).json(message);
}

let handleVerifyAccountUser = async (req, res) => {
    let data = req.body;
    let message = await userService.verifyAccountUser(data);
    return res.status(200).json(message);
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!"
        })
    }
    let message = await userService.deleteUser(req.body.id);
    console.log(message);
    return res.status(200).json(message);
}

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        console.log('Get AllCode Error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let handleSendCode = async (req, res) => {
    let data = req.body;
    let message = await userService.sendCode(data);
    return res.status(200).json(message);
}

let handleCheckSendCode = async (req, res) => {
    let data = req.body;
    let message = await userService.checkSendEmail(data);
    return res.status(200).json(message);
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateUser: handleCreateUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    handleVerifyAccountUser: handleVerifyAccountUser,
    handleSendCode: handleSendCode,
    handleCheckSendCode: handleCheckSendCode,

}
