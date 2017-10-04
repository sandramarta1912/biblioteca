module.exports ={
    showContact : showContact,
    processContact : processContact
}

var request = require('request');

 function showContact (req, res) {
     res.render('pages/contact', {
         errors: req.flash('errors'),
         csrfToken: req.csrfToken()
     });
}

function processContact(req,res) {

    req.checkBody('name', 'Introdu numele').notEmpty();
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email is not valid.').isEmail();
    const formErrors = req.validationErrors();

    // g-recaptcha-response is the key that browser will generate upon form submit.
    // if its blank or null means user has not selected the captcha, so return the error.
    if(
        req.body['g-recaptcha-response'] === undefined ||
        req.body['g-recaptcha-response'] === '' ||
        req.body['g-recaptcha-response'] === null

    ) {
       formErrors.push({"param": "g-recaptcha-response", "msg": "CSRF-ul e invalid"});
    }

    if (formErrors) {
        return res.render(
            'pages/contact',
            {
                formErrors: formErrors,
                csrfToken: req.csrfToken()
            });
    }


    // Put your secret key here.
    var secretKey = "6LeEoyQUAAAAAOeyDy9D905yhph2CN9_Kapob0bJ";
    // req.connection.remoteAddress will provide IP address of connected user.
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    // Hitting GET request to the URL, Google will respond with success or error scenario.

    request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {

            return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
        }
        // todo trimite raspuns cu eroare de captcha
        res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
    });
    
}