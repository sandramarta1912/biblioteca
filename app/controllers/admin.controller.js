module.exports = {
    admin:admin,
    showUsers: showUsers,
    showCreateBook: showCreateBook,
    processCreateBook: processCreateBook,
    showCreateUser: showCreateUser,
    processCreateUser: processCreateUser
};

function admin (req, res)  {
        res.render('pages/admin/admin', {
            csrfToken: req.csrfToken()
        });
}

function showUsers (req, res) {
        let itemsPerPage = 10;
        let currentPage = req.query.page != undefined ? req.query.page : 1;
        let offset = itemsPerPage * (currentPage - 1);

        // get all books
        User.paginate({}, { offset: offset, limit: itemsPerPage }, function(err, result) {
            if (err) {
                res.status(404);
                return res.send('Oops... Something is awfully wrong!');
            }

            let pagination = new Pagination(req.url, result.total, itemsPerPage);

            // get all books
            User.find({}, (err, users) => {
                if (err) {
                    res.status(404);
                    res.send('User not found!');
                }
                
                
                res.render('pages/admin/users', {
                    users: result.docs,
                    pagination: pagination.paginate(),
                    success: req.flash('success'),
                    csrfToken: req.csrfToken()
                });

            });

        });
}
    
function showCreateBook (req, res)  {
    res.render('pages/admin/createbook',{
        errors: req.flash('errors'),
        csrfToken: req.csrfToken()
    });
}

function processCreateBook (req, res) {
//validate information
    req.checkBody('name', `Name is required.`).notEmpty();
    req.checkBody('author', `Description is required.`).notEmpty();
    req.checkBody('about', 'About is required.').notEmpty();

    // if there are errors, redirect  and save errors to flash
    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect('/admin/create');
    }

    //create new book
    const book = new Book({
        name: req.body.name,
        author: req.body.author,
        about: req.body.about
    });

    //save book
    book.save((err) => {
        if (err) {
            throw err;
        }
        //set a successful flash message
        req.flash('success', 'Successfuly created book!');
        //redirect to the newly created book
        res.redirect(`/books`);
    });
}

function showCreateUser (req, res)  {

}
function processCreateUser (req, res)  {

}

