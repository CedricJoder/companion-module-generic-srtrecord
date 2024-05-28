const { InstanceStatus } = require('@companion-module/base')

const fs = require('fs');
const readline = require('readline');

module.exports = {
	openFile() {
		let self = this; // required to have reference to outer `this`
		
		const rate = self.config.rate;

		self.readFile();
		self.updateStatus(InstanceStatus.Ok);
	},

	startrecording(initialdata) {
		let self = this; // required to have reference to outer `this`

		self.starttime = new Date.getTime();
		self.running = 1;
		self.subnumber = 1;
		self.previoustime = '00:00:00,000';
		self.previousvalue = initialdata;
	},

	newdata(data) {
		let self = this; // required to have reference to outer `this`

		let time = new Date().getTime()-self.starttime;
		self.appendFile(self.subnumber.toString().concat('\n', 
								 new Date(self.previoustime).toISOString()..substring(11,23).replace('.', ','),
								 ' --> ',
								 new Date(time-1).toISOString()..substring(11,23).replace('.', ','),
								 '\n'\,
								 data.toString());
		self.subnumber += 1;
		self.previoustime = time;
	},
	

	readFile() {
		let self = this;
	
		let path = self.config.path;
		let encoding = self.config.encoding;
	
		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
			}
	
			fs.readFile(path, encoding, (err, data) => {
				if (err) {
					self.updateStatus(InstanceStatus.BadConfig, 'Error Reading File');
					self.log('error', 'Error reading file: ' + err);
					self.stopInterval();
				}
				else {
					self.updateStatus(InstanceStatus.Ok);
					self.filecontents = data;
					self.datetime = new Date().toISOString().replace('T', ' ').substr(0, 19);
					self.checkVariables();
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Reading File: ' + error);
		}
	},

	writeFile() {
		let self = this;
	
		let path = self.config.path;
		let encoding = self.config.encoding;
	
		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
			}
	
			fs.writeFile(path, self.writebuffer, {encoding:encoding}, (err) => {
				if (err) {
					self.updateStatus(InstanceStatus.BadConfig, 'Error Reading File');
					self.log('error', 'Error writding file: ' + err);
					self.stopInterval();
				}
				else {
					self.updateStatus(InstanceStatus.Ok);
					self.datetime = new Date().toISOString().replace('T', '_').substr(0, 19);
					self.checkVariables();
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Writing File: ' + error);
		}
	},


	setWritebuffer(data) {
		let self = this;
  self.writebuffer = data;
 },

	appendFile(data) {
		let self = this;
	
		let path = self.config.path;
		let encoding = self.config.encoding;
	
		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
			}

			fs.open(path, 'a', (err, fd) => {
				if (err) {
					self.updateStatus(InstanceStatus.BadConfig, 'Error Opening File');
					self.log('error', 'Error opening file: ' + err);
					self.stopInterval();
				}
				else {
					self.fd = fd;
					fs.write(fd, data, null, encoding, (err, written, str) => {
						if (err) {
							self.updateStatus(InstanceStatus.BadConfig, 'Error Opening File');
							self.log('error', 'Error writing file: ' + err);
							self.stopInterval();
						}
						else {
							      self.updateStatus(InstanceStatus.Ok);
							self.checkVariables();
						}
					});
					fs.close(fd);
    self.readFile();
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

	stopInterval() {
		let self = this; // required to have reference to outer `this`

		if (self.config.verbose) {
			self.log('debug', 'Stopping File Read Interval.');
		}
		clearInterval(self.INTERVAL);
		self.INTERVAL = null;
	}
}
