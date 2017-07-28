module.exports = {
	//show the home page
	showHome: (req, res) => {
		res.render('pages/home', {
			layout: 'layout',
			csrfToken: req.csrfToken()
		});
	},

	showProgram:(req, res) => {
		res.render('pages/program', {
			csrfToken: req.csrfToken()
		});
	}
	
};

