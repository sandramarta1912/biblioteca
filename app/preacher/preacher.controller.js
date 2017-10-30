
module.exports = {
    showPreacher: (req, res) => {
        res.render('pages/preacher&sermon/preachers.pug', {
            csrfToken: req.csrfToken()
        });
    }
};