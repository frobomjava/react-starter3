/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	hello: function(req,res) {
		if (req.isSocket) {
			console.log("in hello - req : " + res);//JSON.stringify(res)
			//return res.view('hello', {hello: '***** Respond form hello *****'});
			return res.send({hello: '***** Respond form hello *****'});
		}
		return res.view('hello');
	},
	projects: function(req,res) {
		//console.log("userName in projects " + req.session.userName);

		if (!req.session.userName || req.param('userName') != req.session.userName) {
			console.log("bad request...");
			return res.badRequest('Not signed in user!');
			//return res.redirect('/signin');
		}

		if(req.isSocket){
			console.log('userId : ' + req.session.me);
			var userId = req.session.me;
			var criteria = {user: userId};

			async.series([
				function findUser(callback) {
	          		User.findOne({id: userId}).exec(function(err, user) {
			            if (err) {
							callback(err);
						}
						else if (user) {
							criteria.user = user.id;
							callback();
						}
						else {
							callback({message: 'no user'})
						}
					});
				},

				function findProject(callback) {
					console.log("criteria : " + JSON.stringify(criteria));
					Project.find(criteria).sort('name ASC').exec(function(err, projects) {
						console.log('*** finding projects ***');
			            if (err) {
							callback(err);
						} else if (projects.length>0) {
							console.log('projects ' + JSON.stringify(projects));
						  	return res.send(projects);
							callback();
						} else {
							callback({message : 'no projects yet...'});
						}
					});
				}
			],
			function(err) {
        		res.serverError(err);
			}
		);

		}
		else {
			var userName = req.session.userName;
			return res.view('project', {'userName': userName});
		}
	},
	create: function(req, res) {

		if(req.method === 'POST' && req.param('userName') === req.session.userName
		 && req.param('name') != 'undefined'){

			var userName =  req.session.userName;

			console.log("userName : " + userName);

			var newProjectName = req.param('name');
			console.log("newProjectName : " + newProjectName);			

			if (!newProjectName.trim().length) {
				return res.send(500, { error: 'Project name is empty' });
			}

			var filessystem = require('fs');
			var dir = process.cwd()+'\\projects';
			if (!filessystem.existsSync(dir)) {

				filessystem.mkdirSync(dir);
			}
			
			dir = process.cwd()+'\\projects\\'+userName;

			if (!filessystem.existsSync(dir)) {

				filessystem.mkdirSync(dir);
			}

			var projectdir = dir+'\\'+newProjectName;

			if (!filessystem.existsSync(projectdir)) {

				filessystem.mkdirSync(projectdir);
				console.log(projectdir + " Directory created successfully!");

				User.findOne({userName: userName}).exec(function (err,foundUser){
					console.log('find user...');
					if (err) return res.serverError(err);

					if (foundUser) {
						console.log("foundUser : " + foundUser.userName);

						Project.create({
						name: newProjectName,
						url : projectdir,
						user : foundUser
						}).exec(function(error, newProject){
							if(error){
								console.log(error);
								return res.serverError(error);
							} else {
								console.log(newProject.name + ' project is created..');
								Project.publishCreate({id:newProject.id, name:newProjectName});
								return res.redirect('/'+userName+'/project');
							}
						});
					}
				});
			}
			else {
					console.log('Project is already exit...');
					res.send(500, { error: 'Project is already exit...' });
					//return res.serverError('Project is already exit...', '/'+userName+'/project');
					//return res.redirect('/'+userName+'/project');
			}
		}
		else {
			return res.badRequest('Bad Request!');
			// if (req.session.userName) {
			// 	return res.redirect('/'+req.session.userName+'/project');
			// }
			// return res.redirect('/signin');
		}
	}
	
};
