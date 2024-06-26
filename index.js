const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')

const UpgradeScripts = require('./src/upgrades');

const configFields = require('./src/configFields');
const api = require('./src/api');
const actions = require('./src/actions');
const variables = require('./src/variables');
const feedbacks = require('./src/feedbacks');
const presets = require('./src/presets');

class GenericSrtRecordInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...configFields,
			...api,
			...actions,
			...variables,
			...feedbacks,
			...presets,			
		})

		this.filecontents = '';
		this.path = '';
		this.running = false;
		this.starttime = 0;
		this.subnumber = 1;
		this.previoustime = 0;
		this.previousvalue = '';
		this.currentvalue = '';

		this.ENCODING_TYPES = [
			{ id: 'utf8', label: 'utf8'},
			{ id: 'utf16le', label: 'utf16le'},
			{ id: 'latin1', label: 'latin1'},
			{ id: 'base64', label: 'base64'},
			{ id: 'base64url', label: 'base64url'},
			{ id: 'hex', label: 'hex'}
		];
	}

	async init(config) {
		this.updateStatus(InstanceStatus.Connecting);
		this.configUpdated(config);
	}

	async configUpdated(config) {
		if (config) {
			this.config = config
		}

		this.updateStatus(InstanceStatus.Ok);

		this.initActions();
		this.initFeedbacks();
		this.initVariables();
		this.initPresets();

		this.checkVariables();
		this.checkFeedbacks();

		this.updateStatus(InstanceStatus.Connecting, 'Checking File...');
		let path = await this.parseVariablesInString(this.config.path);
		this.checkFile(path);
	}

	async destroy() {
		//close out any connections
		this.stoprecording('');
		this.debug('destroy', this.id);
	}

}

runEntrypoint(GenericSrtRecordInstance, UpgradeScripts)
