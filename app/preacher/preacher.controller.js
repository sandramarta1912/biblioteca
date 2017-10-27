module.exports = {

    //show the body.pug page
    showPreacher: (req, res) => {
        res.render('pages/preacher&sermon/preacher.pug', {
            // csrfToken: req.csrfToken()
        });
    },
    showCreate: (req, res) => {
        res.render('pages/preacher&sermon/createpreacher.pug', {

        });
    }
};