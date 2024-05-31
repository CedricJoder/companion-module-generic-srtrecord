module.exports = {
	initVariables() {
		let variables = [
			{ name: 'File Path', variableId: 'path'},
			{ name: 'File Contents', variableId: 'contents'},
			{ name: 'Current Sub Number', variableId: 'subnumber'},
			{ name: 'Current Value', variableId: 'currentvalue'},
			{ name: 'Recording Start Time', variableId: 'starttime'},
		]
		this.timeOffset = new Date().getTimezoneOffset()* -60000;
		this.setVariableDefinitions(variables);
	},

	checkVariables() {
		try {
			let variableObj = {};

			variableObj['path'] = this.config.path;
			variableObj['contents'] = this.filecontents;
			variableObj['subnumber'] = this.subnumber;
			variableObj['currentvalue'] = this.currentvalue;
			variableObj['starttime'] = new Date(this.starttime + this.timeOffset).toISOString().substring(11,19);
			
			this.setVariableValues(variableObj);
		}
		catch(error) {
			//do something with that error
			if (this.config.verbose) {
				this.log('debug', 'Error Updating Variables: ' + error);
			}
		}
	}
}
