var irm = require('irmagician');
var Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
    console.log("homebridge API version: " + homebridge.version);

    // Service and Characteristic are from hap-nodejs
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid;

    // For platform plugin to be considered as dynamic platform plugin,
    // registerPlatform(pluginName, platformName, constructor, dynamic), dynamic must be true
    homebridge.registerAccessory("homebridge-irmagician", "irMagician", irMagician);
}

// Platform constructor
// config may be null
// api may be null if launched from old homebridge version
function irMagician(log, config, api) {
    this.log = log;
    this.type = config["type"];
    this.name = config["name"];
    this.on_file = config["on_file"];
    this.off_file = config["off_file"];
}

irMagician.prototype = {

	irmRequest: function(cmd, callback) {
		exec(cmd,function(error, stdout, stderr) {
			callback(error, stdout, stderr);
		});
	},

	setPowerState: function (powerOn, callback) {
		var file;

		if (powerOn) {
			file = this.on_file;
			this.log("Setting power state to on");
		} else {
			file = this.off_file;
			this.log("Setting power state to off");
		}
        if (typeof file) { file = null; }

        irm[this.type](file, null, () => {
            callback();
        });

	},

    getTempState: function (callback) {
        var temperature = irm[this.type](null, null, (temp) => {
            this.log(parseInt(temp));
            callback(null, parseInt(temp));
        });
    },

	identify: function (callback) {
		this.log("Identify requested!");
		callback(); // success
	},

	getServices: function () {

		// you can OPTIONALLY create an information service if you wish to override
		// the default values for things like serial number, model, etc.
		var informationService = new Service.AccessoryInformation();

		informationService
			.setCharacteristic(Characteristic.Manufacturer, "irMagician Manufacturer")
			.setCharacteristic(Characteristic.Model, "irMagician Model")
			.setCharacteristic(Characteristic.SerialNumber, "irMagician Serial Number");

        var service = null;
        if (this.type == "temp") {
            var tempService = new Service.TemperatureSensor(this.name);
            tempService
                .getCharacteristic(Characteristic.CurrentTemperature)
                .on('get', this.getTempState.bind(this));
            service = tempService;
        } else {
		    var switchService = new Service.Switch(this.name);
            switchService
			    .getCharacteristic(Characteristic.On)
			    .on('set', this.setPowerState.bind(this));
            service = switchService;
        }
		return [service];
	}
};
