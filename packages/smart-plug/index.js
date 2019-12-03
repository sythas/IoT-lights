const { Client } = require("tplink-smarthome-api");
const { send } = require("micro");

// keep all discovered devices
const devices = {};

// Start listening for new devices on the network
const client = new Client();
client.startDiscovery().on("device-new", device => {
  console.log(`Discovered device ${device.alias}.`);
  devices[device.alias] = device;
});

// Handle HTTP requests
module.exports = (req, res) => {
  let params = req.url.split("/").slice(1);

  if (!params[0] || !devices[params[0]]) {
    return send(res, 404, "Device not found.");
  }

  if (!params[1] || !/on|off|toggle/i.test(params[1])) {
    return send(res, 500, "Unsupported Command.");
  }

  const device = devices[params[0]];
  const command = params[1].trim().toUpperCase();

  switch (command) {
    case "ON":
      if (!device.inUse) device.setPowerState(true);
      break;
    case "OFF":
      if (device.inUse) device.setPowerState(false);
      break;
    case "TOGGLE":
      device.setPowerState(!device.inUse);
  }

  return "ok";
};
