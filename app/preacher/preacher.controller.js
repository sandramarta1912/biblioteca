module.exports = {

    //show the body.pug page
    showPreacher: (req, res) => {
        // TODO What route is this?
        res.render('pages/preacher & sermon/preacher.pug', {
            // csrfToken: req.csrfToken()
        });
    }
    
    // TODO Add create preacher handler
    
    // TODO Add edit preacher handler
    
    // TODO Add delete preacher handler
};
