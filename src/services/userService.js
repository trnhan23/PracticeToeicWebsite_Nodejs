import db from '../models/index'
import bcrypt from 'bcryptjs';
import emailService from './emailService';
const salt = bcrypt.genSaltSync(10);
import { v4 as uuidv4 } from 'uuid';

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
                    attributes: ['id', 'email', 'roleId', 'password', 'fullName', 'avatar', 'status'],
                    where: { email: email },
                    raw: true,
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {

                        if (user.status === 1) {
                            userData.errCode = 0;
                            userData.errMessage = 'ok';

                            delete user.password;
                            userData.user = user;
                        } else {
                            userData.errCode = 4;
                            userData.errMessage = 'Tài khoản chưa kích hoạt';
                        }
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Sai mật khẩu';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `Người dùng không tồn tại!`
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Email không tồn tại. Hãy nhập email khác!`
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

let buildUrlEmail = (email, token) => {
    let result = '';
    result = `${process.env.REACT_URL}/verify?token=${token}&email=${email}`
    return result;
}

let createUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let id = uuidv4();
            let result = buildUrlEmail(data.email, id);
            let checkEmail = await checkUserEmail(data.email);
            if (checkEmail === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used. Plz try another email!'
                })
            } else {
                await emailService.sendSimpleEmail(data.email, result);
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    password: hashPasswordFromBcrypt,
                    token: data.token,
                    email: data.email,
                    fullName: data.fullName,
                    gender: data.gender === '1' ? true : false,
                    avatar: data.avatar,
                    bio: data.bio || "",
                    registrationDate: new Date().toISOString(),
                    roleId: data.roleId,
                    status: false,
                    token: id,
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
                user.status = data.status;
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

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            if (!typeInput) {
                res.errCode = 1;
                res.data = "Missing required parameter";
            } else {
                let allcode = await db.AllCode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
            }
            resolve(res);
        } catch (e) {
            reject(e);
        }
    })
}

let verifyAccountUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.email) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let user = await db.User.findOne({
                    where: {
                        token: data.token,
                        email: data.email
                    },
                    raw: false
                })
                if (user) {
                    user.status = true;
                    await user.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Active account user success!'
                    });
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: `Usern't not found`
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let sendCode = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter",
                });
            } else {
                const code = Math.floor(10000000 + Math.random() * 90000000);
                let checkEmail = await checkUserEmail(data.email);
                if (checkEmail === false) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Email không tồn tại!'
                    })
                } else {
                    // gửi mã otp qua email
                    await emailService.sendVerificationEmail(data.email, code);
                    // cập nhật mã OTP
                    let user = await db.User.findOne({
                        where: { email: data.email },
                        raw: false
                    })
                    if (user) {
                        user.OTP = code;
                        await user.save();
                        resolve({
                            errCode: 0,
                            errMessage: "ok",
                        });
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: `Lỗi cập nhật OTP`
                        });
                    }
                }
            }
        } catch (e) {
            console.error("Error in sendCode:", e);
            reject({
                errCode: -1,
                errMessage: "Internal server error",
            });
        }
    });
};

let checkOTP = (email, otpUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email },
                raw: false
            })

            if (user.OTP === otpUser) {
                resolve({
                    errCode: 0
                })
            } else {
                resolve({
                    errCode: 1,
                });
            }
        } catch(e) {
            reject({
                errCode: -1,
            });
        }
    })
}

let checkSendEmail = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.otp || !data.password) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing parameter",
                });
            } else {
                let checkEmail = await checkUserEmail(data.email);
                if (checkEmail === false) {
                    return resolve({
                        errCode: 1,
                        errMessage: 'Email không tồn tại!'
                    });
                } else {
                    let resOTP = await checkOTP(data.email, data.otp);
                    if (resOTP.errCode === 0) {
                        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                        
                        let user = await db.User.findOne({
                            where: { email: data.email },
                            raw: false
                        });
                        if (user) {
                            user.password = hashPasswordFromBcrypt;
                            await user.save();
                            return resolve({
                                errCode: 0,
                                errMessage: "ok",
                            });
                        } else {
                            return resolve({
                                errCode: 1,
                                errMessage: `Người dùng không tồn tại`
                            });
                        }
                    } else {
                        return resolve({
                            errCode: 1,
                            errMessage: `OTP không tồn tại`
                        });
                    }
                }
            }
        } catch (e) {
            console.error("Error in sendCode:", e);
            return reject({
                errCode: -1,
                errMessage: "Internal server error",
            });
        }
    });
};


module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getAllCodeService: getAllCodeService,
    verifyAccountUser: verifyAccountUser,
    sendCode: sendCode,
    checkSendEmail: checkSendEmail,

}