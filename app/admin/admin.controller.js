module.exports ={
    admin: (req, res) => {
        res.render('pages/admin/admin.pug', {

        });
    },
    
    showPreacher: (req, res) => {
        res.render('pages/admin/preachers.pug', 'pages/preacher & sermon/preacher.pug', {
            // csrfToken: req.csrfToken()
        });
    },
    showSermons: (req, res) => {
        res.render('pages/admin/sermons.pug', {
            // csrfToken: req.csrfToken()
        });
    }
    
};