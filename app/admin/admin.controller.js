var Preacher= require('../models/preacher');
var Sermon= require('../models/sermon');
var Pagination = require('../utils/Pagination');

module.exports = {
    admin: admin,
    showPreachers: showPreachers,
    showSermons: showSermons,
    showCreatePreacher: showCreatePreacher,
    processCreatePreacher: processCreatePreacher,
    showCreateSermon: showCreateSermon,
    processCreateSermon: processCreateSermon,
    //deleteSermon: deleteSermon,
    deletePreacher: deletePreacher,
    showEditPreacher: showEditPreacher,
    processEditPreacher: processEditPreacher
};
function admin (req, res)  {
    res.render('pages/admin/admin.pug', {});
}
function showPreachers (req, res) {
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
            res.render('pages/admin/preachers.pug', {
                preachers: result.docs,
                pagination: pagination.paginate(),
                success: req.flash('success'),
                csrfToken: req.csrfToken()
            });
        });
    });
}
function showCreatePreacher (req, res) {
    res.render('pages/admin/createpreacher.pug', {
        csrfToken: req.csrfToken()
    });
}
function processCreatePreacher (req, res)  {
    req.checkBody('firstName', 'Firstname is required.').notEmpty();
    req.checkBody('lastName', 'Lastname is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect('/admin/preacher/create');
    }
    //create new preacher
    const preacher = new Preacher({
        // _id: new ObjectID(),
        lastName: req.body.lastName,
        firstName: req.body.firstName
    });
    //save reader
    preacher.save((err, preacher) =>{
        if(err){
            req.flash('errors', 'The reader could not be created. There are errors!');
            return res.redirect('/admin/preacher/create');
        }
        //set a successful flash message
        req.flash('success', 'Successfuly created preacher!');
        //redirect to the newly created preacher
        res.redirect(`/admin/preachers`);

    });
}
function showEditPreacher (req, res) {
    Preacher.findOne({slug: req.params.slug}, (err, preacher)=>{
        if(err) {
            res.status(404);
            return res.send('Oops... That preacher does not exist!');
        }
        res.render('pages/admin/editpreacher', {
            preacher: preacher,
            errors: req.flash('errors'),
            csrfToken: req.csrfToken()
        });
    });
}
function processEditPreacher (req, res) {
    req.checkBody('firstName', `FirstName is required.`).notEmpty();
    req.checkBody('lastName', `LastName is required.`).notEmpty();

    // if there are errors, redirect  and save errors to flash
    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect(`/admin/preacher/${req.params.slug}/edit`);
    }
    // finding a current preacher
    Preacher.findOne({ slug: req.params.slug }, (err, preacher) => {
        // updating that preacher
        preacher.firstName = req.body.firstName;
        preacher.lastName = req.body.lastName;

        preacher.save((err) => {
            if (err) {
                req.flash('error', 'The preacher could not be updated!');
                return res.redirect(`/admin/preacher/${req.params.slug}/edit`);
            }

            // redirect back to the preachers
            req.flash('success', 'Successfully updated preacher!');
            res.redirect('/admin/preachers');
        });

    });
}
function deletePreacher (req, res) {
    Preacher.remove({slug: req.params.slug}, (err) => {
        if (err) {
            req.flash('error', 'The book could not be deleted!');
            return res.redirect('/admin/preachers');
        }
        req.flash('success', 'Preacher deleted!');
        res.redirect('/admin/preachers');

    });
}

function showSermons (req, res) {
    Sermon.find({}, (err, sermons) => {
        if (err) {
            res.status(404);
            res.send('Sermon not found!');
        }
        res.render('pages/admin/preachers.pug', {
            sermons: result.docs,
            pagination: pagination.paginate(),
            success: req.flash('success'),
            csrfToken: req.csrfToken()
        });
    });
}
function showCreateSermon  (req, res)  {
    res.render('pages/admin/createsermon', {
        csrfToken: req.csrfToken()
    });
}
function processCreateSermon (req, res)  {
    req.checkBody('title', 'Title is required.').notEmpty();
    req.checkBody('Duration', 'Duration is required').notEmpty();
    req.checkBody('Preacher', 'Preacher is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect('/admin/sermon/create');
    }
    //create new sermon
    const sermon = new Sermon ({
        // _id: new ObjectID(),
        title: req.body.title,
        preacher: req.body.preacher
    });
    //save sermon
    sermon.save((err, preacher) =>{
        if(err){
            req.flash('errors', 'The reader could not be created. There are errors!');
            return res.redirect('/admin/sermon/create');
        }
        //set a successful flash message
        req.flash('success', 'Successfuly created sermon!');
        //redirect to the newly created reader
        res.redirect(`/admin/sermons`);

    });
}
