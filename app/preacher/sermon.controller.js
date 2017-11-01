
var Sermon= require('../models/sermon');
module.exports = {
    showSermons: (req, res) => {
        res.render('pages/preacher&sermon/sermons.pug', {
            // csrfToken: req.csrfToken()
        });
    }
};