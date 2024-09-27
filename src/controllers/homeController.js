import userService from '../services/userService';

let getHomePage = async (req, res) => {
    let data = await userService.getAllUsers('ALL');
    return res.render('homepage.ejs', {
        dataTable: data
    })
}

module.exports = {
    getHomePage: getHomePage,
}