const { combineRgb } = require('@companion-module/base')

module.exports = {
    // ##########################
    // #### Define Feedbacks ####
    // ##########################
    initFeedbacks() {
        let self = this;
        const feedbacks = {};

        const foregroundColorWhite = combineRgb(255, 255, 255) // White
        const foregroundColorBlack = combineRgb(0, 0, 0) // Black
        const backgroundColorRed = combineRgb(255, 0, 0) // Red
        const backgroundColorGreen = combineRgb(0, 255, 0) // Green
        const backgroundColorOrange = combineRgb(255, 102, 0) // Orange

	feedbacks.isRecording = {
		type: 'boolean',
		name: 'Recording is running',
		description: 'Change colors of the bank if the recording is running',
		defaultStyle: {
			color: foregroundColorWhite,
			bgcolor: backgroundColorRed,
		},
		options: [],
		callback: async function (feedback, context) {
			if (self.config.verbose) {
				self.log('debug', 'Testing Status');
			}
			if (self.running) {
				return true;
			}

			return false;
		},
	};


	feedbacks.autoWrite = {
		type: 'advanced',
		name: 'Auto write on data change',
		description: 'Automatically write new data when value changes. Workaround for variable watching',
		/*defaultStyle: {
			color: backgroundColorGreen,
			//bgcolor: backgroundColorRed,
		},*/
		options: [],
		callback: async function (feedback, context) {

			let data = await context.parseVariablesInString(self.config.data);

			//self.log('debug', 'autowrite : ' + data);
			if (self.running) {
				self.writedata(data);
			}
		},
	};

        self.setFeedbackDefinitions(feedbacks);
    }
}