/**
 * DtFileController
 *
 * @description :: Server-side logic for managing Dtfiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var jsonFile = require('jsonfile');
module.exports = {
	files: function(req,res) {
		//console.log("userName in projects " + req.session.userName);

		if (!req.session.userName || req.param('userName') != req.session.userName) {
			console.log("bad request...");
			return res.badRequest('Not signed in user!');
			//return res.redirect('/signin');
		}

		if (!req.param('projectName')) {
			console.log('projectName : ' + projectName);
			return res.back();
		}		
			console.log('userId : ' + req.session.me);
			var userId = req.session.me;
			var userName = req.session.userName;
			var projectName = req.param('projectName');
			var criteria = {project: 0};

			async.series([				

				function findProject(callback) {
					//console.log("criteria : " + JSON.stringify(criteria));
					Project.findOne({name: projectName, user: userId}).exec(function(err, project) {
						console.log('*** getting project ***');
			            if (err) {
							callback(err);
						}
						if (project) {
							console.log('project ' + JSON.stringify(project));
							criteria.project = project.id;
							callback();
						  	//return res.send(projects);
							//return res.view('project', {projectList : projects, userName: userName});
						} 
					});
				},

				function findFiles(callback) {
					console.log("criteria : " + JSON.stringify(criteria));
					DtFile.find(criteria).sort('name ASC').exec(function(err, files) {
						console.log('*** finding files ***');
			            if (err) {
							callback(err);
						}
						if (files) {
							console.log('files ' + JSON.stringify(files));
						  	//return res.send(projects);
							return res.view('workspace', {filesList : files, projectName: projectName, userName: userName});
						} 
					});
				}
			],
			function(err) {
        		res.serverError(err);
			}
		);		
	},

	create: function(req, res) {

		if(req.isSocket && req.param('userName') === req.session.userName
		 && req.param('fileName') != 'undefined' && req.param('projectName')){

		 	var userId = req.session.me;

			var userName =  req.session.userName;
			console.log("userName : " + userName);

			var projectName =  req.param('projectName');
			console.log("projectName : " + projectName);

			var newFileName = req.param('fileName');
			console.log("newFileName : " + newFileName);

			if (!newFileName.trim().length) {
				console.log("xxx newFileName is empty xxx");
				return res.send(500, { error: 'File name is empty' });
			}

			var filessystem = require('fs');

			var dir = process.cwd()+'\\projects\\'+userName+'\\'+projectName;

			if (!filessystem.existsSync(dir)) {

				filessystem.mkdirSync(dir);
			}

				Project.findOne({name: projectName, user: userId}).exec(function (err,foundProject){
					console.log('find project...');
					if (err) return res.serverError(err);

					if (foundProject) {
						console.log("foundProject : " + foundProject.name);

						async.series([
										function findDtFile(callback) {
											DtFile.findOne({name: newFileName,project: foundProject.id}).exec(function(err, file) {
									            if (err) {
													callback(err);
												}
												else if (file) {
													console.log(newFileName + ' is already exit...');
													return res.send(500, { error: newFileName + ' is already exit...' });
													callback();
												}
												else{
													callback();
												}
											});
										},
										function createFile(callback) {
											console.log("preparing to create file...");
											var filePath = dir + '\\' + newFileName+'.json';

											var obj = {
														names: {conditions: [''], actions: ['']},
														rules: [
									 							{
									 								conditions : [''],
									 								actions :['']
									 							}
									 							]
														}

											jsonFile.writeFile(filePath, obj, function(err){

							 					if(err) console.error(err);

							 					else{

							 						DtFile.create({
															name: newFileName,
															project : foundProject
								 						}).exec(function(error,newFile){
								 							if(error) {
								 								console.log("this is file create error "+error);
								 							}
								 							else {
								 								console.log(newFile.name + ' new File is created..');
								 								console.log(newFile);
								 								return res.redirect('/'+userName+'/project/in/'+ projectName + '/files');
								 								callback();
								 							}
								 						}); 
							 					}

					 						});
										}
									],
									function(err) {
						        		res.serverError(err);
									}
						);						

	 					// var obj = {
			 			// 			dt:{
			 			// 				conditions :["condition1"],
			 			// 				actions: ["action1"],
			 			// 				rules: [
				 		// 					{
				 		// 						conditions : [],
				 		// 						actions :[]
				 		// 					}
			 			// 				]
		 				// 			}
	 					// 		}

					}
				});
			
			// else {
			// 		// console.log('Project is already exit...');
			// 		// res.send(500, { error: 'Project is already exit...' });
			// 		//return res.serverError('Project is already exit...', '/'+userName+'/project');
			// 		//return res.redirect('/'+userName+'/project');
			// }
		}
		else {
			return res.badRequest('Bad Request!');
		}
	}
};

