const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module records a specified data and stores the timestamped values in a text file, with a srt subtitle format.'
			},

			{
				type: 'textinput',
				id: 'pdata',
				width: 6,
				label: 'Data to Record',
				useVariables: true,
				default: ''
			},

			{
				type: 'textinput',
				id: 'path',
				width: 6,
				label: 'File Path',
				default: ''
			},

			{
				type: 'checkbox',
				id: 'apdate',
				label: 'Append Date',
				default: true
			},

			{
				type: 'checkbox',
				id: 'aptime',
				label: 'Append Time',
				default: true
			},

			{
				type: 'dropdown',
				id: 'encoding',
				width: 6,
				label: 'File Encoding',
				default: 'utf8',
				choices: this.ENCODING_TYPES
			},
			{
				type: 'number',
				id: 'rate',
				width: 6,
				label: 'Re-Read Rate (in ms) (set to 0 to read file once and not again unless manually activated)',
				default: 60000
			},
			{
				type: 'static-text',
				id: 'dummy2',
				width: 12,
				label: ' ',
				value: ' '
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false
			}
		]
	},
}
