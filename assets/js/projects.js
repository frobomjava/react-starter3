var ProjectList = React.createClass({
	componentWillMount: function() {

		// var self = this;
		// io.socket.on('newProject', function(data) {
	 //      console.log("in componentWillMount new project created..");
	 //      //console.log(data.userName);
	 //      self.updateProjectList(data);
	 //    });

	    io.socket.get('/project/socket/join', function (resData) {
	    	console.log("... client socket join to server socket ...");
	       	console.log('resData ' + resData);
	    });

	    var self = this;

	    io.socket.on('newProject', function(project) {
	      console.log("new project " + project.name + ' arrive...');
	      console.log(JSON.stringify(project));
	      
	      self.updateProjectList(project);
	    });
	    
	},
	getInitialState: function(){
	    return { projects: prjList }
    },
    updateProjectList: function(project) {
    	console.log('new project\'s name : ' + project.name);
    	var projects = this.state.projects.slice(0);
    	projects.push(project);
    	this.setState({
	      projects: projects
	    });
	    document.getElementById('txtProject').value = "";
    },
	render: function() {
		// projectList.forEach(function(project, i) {
      	// document.getElementById('projects').innerHTML += (i+1) + '. ' + '<a href="">'  + project.name + '</a></br>';
      	var projects = this.state.projects.map(function (project, index) {
      		return(
      			<li key={project.id}>
      				<a href='#'>{project.name}</a>
      			</li>
      		)
      	});

      	return (
	        <ol className="projectList">
	        {projects}
	        </ol>
	    );
    }
});
ReactDOM.render(<ProjectList/>, document.getElementById('project-list-container'));