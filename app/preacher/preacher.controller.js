module.exports = {

    //show the body.pug page
    showPreacher: (req, res) => {
        res.render('pages/preacher & sermon/preacher.pug', {
            // csrfToken: req.csrfToken()
        });
    }
};