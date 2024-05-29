const { InstanceStatus } = require('@companion-module/base')

const fs = require('fs');
const readline = require('readline');

module.exports = {
	checkFile() {
		let self = this; // required to have reference to outer `this`
		let path = self.config.path;
		
		try {
			if (self.config.verbose) {
				self.log('debug', 'Checking File: ' + path);
			}

			if (!self.config.aptime) {
				let path = self.parseVariablesInString(self.config.path);
				if (self.config.apdate)	{
					path.append('_', new Date().toISOString().substring(0,10));
				}

				if (fs.existsSync(self.parseVariablesInString(path)) {
					self.updateStatus(InstanceStatus.BadConfig, 'File exists, overwrite');
					self.log('error', 'File already exists ! Recording will overwrite.');
				}
				else {
					self.updateStatus(InstanceStatus.Ok);
				}
			else {
				self.updateStatus(InstanceStatus.Ok);
			}
		}
		catch(error) {
			self.log('error', 'Error Opening File: ' + error);
		}
	},

	startrecording(initialdata) {
		let self = this; // required to have reference to outer `this`
	
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
			self.starttime = new Date().getTime();
			self.path = self.parseVariablesInString(self.config.path)
				if (self.config.apdate)	{
					self.path.append('_', new Date(self.starttime).toISOString().substring(0,10));
				}
				if (self.config.aptime) {
					self.path.append('_', new Date(self.starttime).toISOString().substring(11,19).replace (';', '-'));
				}
			self.running = 1;
			self.subnumber = 1;
			self.previoustime = '00:00:00,000';
			self.previousvalue = initialdata;
			self.checkVariables();
		}
	},

	writedata(data) {
		let self = this; // required to have reference to outer `this`

		let time = new Date().getTime()-self.starttime;

		if (self.running) {
			self.appendFile(self.subnumber.toString().concat('\n', 
									 new Date(self.previoustime).toISOString().substring(11,23).replace('.', ','),
									 ' --> ',
									 new Date(time-1).toISOString().substring(11,23).replace('.', ','),
									 '\n',
									 data.toString(),
									'\n\n'));
			self.subnumber += 1;
			self.previoustime = time;
		}
		else {
			self.log('error', 'Recording not started');
		}
	},
	

	stoprecording(data) {
		self.writedata(data);
		self.running = 0;
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

/*
	setWritebuffer(data) {
		let self = this;
		self.writebuffer = data;
	},
*/
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

	readFileCustom(path, encoding, customVariable) {
		let self = this;

		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
			}
	
			fs.readFile(path, encoding, (err, data) => {
				if (err) {
					self.log('error', 'Error reading custom file path: ' + err);
				}
				else {
					self.setCustomVariableValue(customVariable, data);
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Reading custom file path: ' + error);
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
