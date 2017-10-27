var Preacher= require('../models/preacher');
var Pagination = require('../utils/Pagination');

module.exports ={
    admin: (req, res) => {
        res.render('pages/admin/admin.pug', {

        });
    },
    
    showPreacher: (req, res) => {
        res.render('pages/admin/preachers.pug',  {
            // csrfToken: req.csrfToken()
        });
    },
    showSermons: (req, res) => {
        res.render('pages/admin/sermons.pug', {
            // csrfToken: req.csrfToken()
        });
    },
    showCreate: (req, res) => {
        res.render('pages/admin/createpreacher.pug', {
            csrfToken: req.csrfToken()
        });
    },
    processCreate: (req, res) => {
        req.checkBody('name', 'Name is required.').notEmpty();
        req.checkBody('age', 'Age is required').notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors.map(err => err.msg));
            return res.redirect('/admin/preacher/create');
        }

        //create new preacher
        const preacher = new Preacher({
            // _id: new ObjectID(),
            name: req.body.name,
            age: req.body.age

        });

        //save reader
        preacher.save((err, preacher) =>{
            if(err){
                req.flash('errors', 'The reader could not be created. There are errors!');
                return res.redirect('/preacher/create');
            }
            //set a successful flash message
            req.flash('success', 'Successfuly created reader!');
            //redirect to the newly created reader
            res.redirect(`admin/preachers`);

        });
    }
    
};