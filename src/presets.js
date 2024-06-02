const { combineRgb } = require('@companion-module/base')

module.exports = {
	initPresets() {
		let self = this;
		
const presets = {}
presets[`Record`] = {
	type: 'button', // This must be 'button' for now
	category: '', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
	name: `Record - auto write`, // A name for the preset. Shown to the user when they hover over it
	style: {
		// This is the minimal set of style properties you must define
		text: self.running ? 'Recording' : 'Record'
//`$(generic-module:some-variable)`, // You can use variables from your module here
		size: 'auto',
		color: combineRgb(255, 255, 255),
		bgcolor: combineRgb(0, 0, 0),
	},
	steps: [
		{
			down: [
				{
					// add an action on down press
					actionId: 'record',
					options: {
						// options values to use
					},
				},
			],
			up: [],
		},
	],
	feedbacks: [
		{
			feedbackId: 'autowrite'
		},
		{
			feedbackId: 'status'
		},
	], // You can add some presets from your module here
}
this.setPresetDefinitions(presets)

		this.setPresetDefinitions(presets)
	},
}
