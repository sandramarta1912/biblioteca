module.exports = {
    showSermons: (req, res) => {
        // TODO What kind o route is this?
        res.render('pages/preacher & sermon/sermons.pug', {
            // csrfToken: req.csrfToken()
        });
    }
    
    // TODO Have a look in preachers.controller.js and implement all those handlers in here, also
};
