const gpio = require("gpio");
const { send } = require("micro");

const signal = gpio.export(14);
let state = false;

// Handle HTTP requests`
module.exports = (req, res) => {
  let params = req.url.split("/").slice(1);

  if (!params[0] || !/on|off|toggle/i.test(params[0])) {
    return send(res, 500, "Unsupported Command.");
  }

  const command = params[0].trim().toUpperCase();

  switch (command) {
    case "ON":
      if (!state) {
        signal.set();
        state = true;
      }
      break;
    case "OFF":
      if (state) {
        signal.reset();
        state = false;
      }
      break;
    case "TOGGLE":
      const command = state ? "reset" : "set";
      signal[command]();
      state = !state;
  }

  return "ok";
};
