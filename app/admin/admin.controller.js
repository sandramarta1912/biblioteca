var Preacher= require('../models/preacher');
var Pagination = require('../utils/Pagination');

module.exports ={
    admin: (req, res) => {
        res.render('pages/admin/admin.pug', {

        });
    },
    
    showPreacher: (req, res) => {
        res.render('pages/admin/preachers.pug',  {
            //csrfToken: req.csrfToken()
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
            req.flash('success', 'Successfuly created reader!');
            //redirect to the newly created reader
            res.redirect(`/admin/preachers`);

        });
    },
    showCreateSermon:  (req, res) => {
        res.render('pages/admin/createsermon', {
            csrfToken: req.csrfToken()
        });
    },
    processCreateSermon: (req, res) => {
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
    
};