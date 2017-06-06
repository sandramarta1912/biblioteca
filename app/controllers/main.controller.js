module.exports = {
	//show the home page
	showHome: (req, res) => {
		res.render('pages/home', {layout: 'layout'});
	},

	showProgram:(req, res) => {
		res.render('pages/program');
	}
};

