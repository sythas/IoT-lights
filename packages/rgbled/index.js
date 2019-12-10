const spi = require("./spi");

const PIXELS = 32;
const DEVICE = "/dev/spidev0.0";
const readBuffer = new Buffer(PIXELS * 3);
const Device = new spi.Spi(DEVICE, function() {});

function createFrame(r, g, b) {
  const buffer = new Buffer(PIXELS * 3);
  for (let i = 0; i < PIXELS; i++) {
    buffer[i * 3] = r;
    buffer[i * 3 + 1] = g;
    buffer[i * 3 + 2] = b;
  }
  return buffer;
}

Device.transfer(createFrame(255, 255, 255), readBuffer);

setTimeout(() => {
  Device.transfer(createFrame(0, 0, 0), readBuffer);
}, 5000);
