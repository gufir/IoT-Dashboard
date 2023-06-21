const coap = require('coap');

function sendRes(){
const req = coap.request('coap://192.168.43.192:5683/Sensor');

req.on('response', (res) => {
  console.log('Response Code:', res.code);
  console.log(res.payload.toString());

});

req.end();}

setInterval(sendRes, 100);

