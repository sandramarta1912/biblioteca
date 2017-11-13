
var Pagination = require('../utils/Pagination');

module.exports = {
    admin: admin
};
function admin (req, res)  {
    res.render('pages/admin/admin.pug', {});
}