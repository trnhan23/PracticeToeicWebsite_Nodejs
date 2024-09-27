import db from '../models/index'
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (pass) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(pass, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'],
                    where: { email: email },
                    raw: true,
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'ok';

                        delete user.password;
                        userData.user = user;

                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exist in your system. Piz try other email`
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === "ALL") {
                users = db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let createUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkEmail = await checkUserEmail(data.email);

            if (checkEmail === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used. Plz try another email!'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    password: hashPasswordFromBcrypt,
                    token: data.token,
                    email: data.email,
                    fullName: data.fullName,
                    gender: data.gender === '1' ? true : false,
                    avatar: data.avatar,
                    bio: data.bio,
                    registrationDate: data.registrationDate,
                    roleId: data.roleId,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                });
            }

            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.fullName = data.fullName;
                user.gender = data.gender;
                user.avatar = data.avatar;
                user.bio = data.bio;
                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Update the user succeeds!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Usern't not found`
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId }
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`
            })
        }
        await db.User.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            errMessage: `The user is delete`
        })
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,

}