var Preacher= require('../models/preacher');
var Pagination = require('../utils/Pagination');
module.exports = {
    showPreacher: showPreacher
};
function showPreacher (req, res ) {
    let itemsPerPage = 10;
    let currentPage = req.query.page != undefined ? req.query.page : 1;
    let offset = itemsPerPage * (currentPage - 1);

    // get all books
    Preacher.paginate({}, {offset: offset, limit: itemsPerPage}, function (err, result) {
        if (err) {
            res.status(404);
            return res.send('Oops... Something is awfully wrong!');
        }

        let pagination = new Pagination(req.url, result.total, itemsPerPage);
        Preacher.find({}, (err, preachers) => {
            if (err) {
                res.status(404);
                res.send('Preacher not found!');
            }
            res.render('pages/preacher&sermon/preachers.pug', {
                preachers: result.docs,
                pagination: pagination.paginate(),
                success: req.flash('success'),
                csrfToken: req.csrfToken()
            });
        });
    });
}
