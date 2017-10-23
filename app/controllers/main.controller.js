
module.exports = {

	//show the body.pug page
	showHome: (req, res) => {
		res.render('pages/body.pug', {
			layout: 'layout'
			// csrfToken: req.csrfToken()
		});
	},

	showProgram:(req, res) => {
		res.render('pages/program.pug', {
			// csrfToken: req.csrfToken()
		});
	},
	admin: (req, res) => {
		res.render('pages/admin/admin.pug', {

		});
	}
};
