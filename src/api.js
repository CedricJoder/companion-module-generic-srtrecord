const { InstanceStatus } = require('@companion-module/base')

const fs = require('fs');
const readline = require('readline');

module.exports = {
	checkFile(path) {
		let self = this; // required to have reference to outer `this`
		let name = path;
		let extension = '';
		
		try {
			
			self.path = path;
			if (name.includes('.')) {
				extension = name.slice(name.lastIndexOf('.'));
				name = name.slice(0 , name.lastIndexOf('.'));
			}
			if (self.config.apdate)	{
				name = name.concat('_', new Date(Date.now() + self.timeOffset).toISOString().substring(0,10));
			}
			path = name.concat(extension);
			
			if (self.config.verbose) {
				self.log('debug', 'Checking File: ' + path);
			}

			if (!self.config.aptime) {
				if (fs.existsSync(path)) {
					self.updateStatus(InstanceStatus.BadConfig, 'File exists, overwrite');
					self.log('error', 'File already exists ! Recording will overwrite.');
				}
				else {
					self.updateStatus(InstanceStatus.Ok);
				}
			}
			else {
				self.updateStatus(InstanceStatus.Ok);
			}
			if (self.config.verbose) {
				self.log('debug', 'Checked File : ' + path);
			}

			self.checkVariables();
		}
		catch(error) {
			self.log('error', 'Error Checking File: ' + error);
		}
	},

	startrecording(initialdata) {
		let self = this; // required to have reference to outer `this`
	
		try {
			if (self.running) {
				if (self.config.verbose) {
					self.log('debug', 'Tried to start already started recording');
				}
				//self.writedata(initialdata);
			}
			else {
				if (self.config.verbose) {
					self.log('debug', 'Starting Recording');
				}
				//append Date and Time
				let name = self.config.path;
				let extension ='';
				if (name.includes('.')) {
					extension = name.slice(name.lastIndexOf('.'));
					name = name.slice(0 , name.lastIndexOf('.'));
				}
				
				self.starttime = Date.now();
				if (self.config.apdate)	{
					name = name.concat('_', new Date(self.starttime + self.timeOffset).toISOString().substring(0,10));
					}
				if (self.config.aptime) {
					name = name.concat('_', new Date(self.starttime + self.timeOffset).toISOString().substring(11,19).replaceAll(':', '-'));
				}
				self.path = name.concat(extension)
				self.running = true;
				self.subnumber = 1;
				self.previoustime = 0;
				self.currentvalue = initialdata;
				self.checkVariables();
				self.clearFile(self.path);
				self.checkFeedbacks();
			
				if (self.config.verbose) {
					self.log('debug', 'Recording to : ' + self.path);
				}
			}
		}
		catch(error) {
			self.log('error', 'Error Starting Recording : ' + error);
		}
	},

	writedata(data) {
		let self = this; // required to have reference to outer `this`
		let previousData = self.currentvalue;
		try {
			if (self.running && (data != previousData)) {
				if (self.config.verbose) {
					self.log('debug', 'Writing data : ' + previousData);
				}
				let time = new Date().getTime()-self.starttime;

				if (previousData != '') {
					self.appendFile(self.subnumber.toString().concat('\n', 
											 new Date(self.previoustime).toISOString().substring(11,23).replace('.', ','),
											 ' --> ',
											 new Date(time-1).toISOString().substring(11,23).replace('.', ','),
											 '\n',
											 previousData.toString(),
											'\n\n'));
					self.subnumber++;
					self.previoustime = time;
				}
				self.previoustime = time;
			}
			else {
				self.log('error', 'Recording not started');
			}

			self.currentvalue = data;
			self.checkVariables();
		}
		catch(error) {
			self.log('error', 'Error Writing data : ' + error);
		}
	},
	

	stoprecording() {
		let self = this;
		try {
			if (self.running) {
				if (self.config.verbose) {
					self.log('debug', 'Stopping recording : ' + self.path);
				}
				self.writedata('');
				self.running = false;
			}
			else {
				self.log('error', 'Recording already stopped');
			}
		}
		catch(error) {
			self.log('error', 'Error Stopping Recording : ' + error);
		}
		self.checkFeedbacks();
	},



	readFile() {
		let self = this;
	
		let path = self.path;
		let encoding = self.config.encoding;
	
		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
			}
	
			fs.readFile(path, encoding, (err, data) => {
				if (err) {
					self.updateStatus(InstanceStatus.BadConfig, 'Error Reading File');
					self.log('error', 'Error reading file: ' + err);
				}
				else {
					self.updateStatus(InstanceStatus.Ok);
					self.filecontents = data;
					self.checkVariables();
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Reading File: ' + error);
		}
	},

	clearFile() {
		let self = this;
	
		let path = self.path;
		let encoding = self.config.encoding;
	
		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
			}
	
			fs.writeFile(path, '', {encoding:encoding}, (err) => {
				if (err) {
					self.updateStatus(InstanceStatus.BadConfig, 'Error Writing File');
					self.log('error', 'Error writing file: ' + err);
				}
				else {
					self.updateStatus(InstanceStatus.Ok);
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Writing File: ' + error);
		}
	},


	appendFile(data) {
		let self = this;
	
		let path = self.path;
		let encoding = self.config.encoding;
	
		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
			}

			fs.appendFile(path, data, {encoding:encoding}, (err) => {
				if (err) {
					self.updateStatus(InstanceStatus.BadConfig, 'Error Writing File');
					self.log('error', 'Error writing file: ' + err);
				}
				else {
						self.updateStatus(InstanceStatus.Ok);
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Writing File: ' + error);
		}
	},

	
	readLine(lineNumber, path, customVariable) {
		let self = this;

		let lineIndex = 0;

		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
				self.log('debug', 'Reading Line: ' + lineNumber);
			}

			const fileStream = fs.createReadStream(path);

			const rl = readline.createInterface({
				input: fileStream,
				crlfDelay: Infinity
			});

			rl.on('line', (line) => {
				lineIndex++;
				if (lineIndex == lineNumber) {
					self.setCustomVariableValue(customVariable, line);
					rl.close();
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Reading Line Number: ' + error);
		}
	},
}
