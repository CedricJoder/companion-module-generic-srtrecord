module.exports = {

	initActions() {
		let self = this; // required to have reference to outer `this`
		let actions = {};

/*
		actions.readFile = {
			name: 'Read File',
			options: [],
			callback: async function (action) {
				self.readFile();
			}
		};
*/

		actions.startRecording = {
			name: 'Start Recording',
			options: [],
			callback: async function (action, context) {
				let data = await context.parseVariablesInString(self.config.data);
				self.startrecording(data);
			}
		};


		actions.stopRecording = {
			name: 'Stop Recording',
			options: [],
			callback: async function (action) {
				self.stoprecording();
			}
		};


		actions.writevalue = {
			name: 'Write New Value',
			options: [],
			callback: async function (action) {
				let data = await self.parseVariablesInString(self.config.data);
				self.writedata(data);
			}
		};

		self.setActionDefinitions(actions);
	},
}
