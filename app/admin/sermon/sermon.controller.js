var Sermon= require('../../models/sermon');
var Pagination = require('../../utils/Pagination');

module.exports = {
    showSermons: showSermons,
    showCreateSermon: showCreateSermon,
    processCreateSermon: processCreateSermon,
    //deleteSermon: deleteSermon,
};

function showSermons (req, res) {
    let itemsPerPage = 10;
    let currentPage = req.query.page != undefined ? req.query.page : 1;
    let offset = itemsPerPage * (currentPage - 1);

    Sermon.paginate({}, {offset: offset, limit: itemsPerPage}, function (err, result) {
        if (err) {
            res.status(404);
            return res.send('Oops... Something is awfully wrong!');
        }

        let pagination = new Pagination(req.url, result.total, itemsPerPage);
        Sermon.find({}, (err, sermons) => {
            if (err) {
                res.status(404);
                res.send('Sermon not found!');
            }
            res.render('pages/admin/sermons.pug', {
                sermons: result.docs,
                //pagination: pagination.paginate(),
                success: req.flash('success'),
                csrfToken: req.csrfToken()
            });
        });
    });
}
function showCreateSermon  (req, res)  {
    Preacher.find({}, (err, preachers) => {
        if (err) {
            // Todo show error page
        }
        console.log(preachers);
        res.render('pages/admin/createsermon.pug', {
            csrfToken: req.csrfToken(),
            preachers: preachers
        });
    });
}
function processCreateSermon (req, res)  {
    req.checkBody('title', 'Title is required.').notEmpty();
    req.checkBody('Preacher', 'Preacher is required').notEmpty();
    req.checkBody('Duration', 'Duration is required').notEmpty();
    req.checkBody('Date', 'Date is required').notEmpty();


    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect('/admin/sermon/create');
    }

    //create new sermon
    const sermon = new Sermon ({
        // _id: new ObjectID(),
        title: req.body.title,
        preacher: req.body.preacher,
        duration: req.body.duration,
        date: req.body.date
    });

    //save sermon
    sermon.save((err, sermon) =>{
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
