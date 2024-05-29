module.exports = {

	initActions() {
		let self = this; // required to have reference to outer `this`
		let actions = {};

		actions.writeFile = {
			name: 'Write File',
			options: [],
			callback: async function (action) {
				self.writeFile();
			}
		};


		actions.startRecording = {
			name: 'Start Recording',
			options: [],
			callback: async function (action) {
				let data = await self.parseVariablesInString(self.config.data);
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
				self.writevalue(data);
			}
		};

		self.setActionDefinitions(actions);
	},
}
