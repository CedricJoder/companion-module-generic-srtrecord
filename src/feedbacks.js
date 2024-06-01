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
			callback: function (feedback, bank) {
				if (self.running) {
					return true
				}

				return false
			},
		}

        self.setFeedbackDefinitions(feedbacks);
    }
}