module.exports = {
    showSermons: (req, res) => {
        res.render('pages/preacher & sermon/sermons.pug', {
            // csrfToken: req.csrfToken()
        });
    },
    showCreate: (req, res) => {
        res.render('pages/preacher&sermon/createsermon.pug', {

        });
    }
};