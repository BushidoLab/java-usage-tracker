const axios = require("axios");

let companyName = "oracle"
let arg = [];

// process.argv gives all parameters passed to the CLI
// In this case process.argv[0] = node and process.argv[1] = node-requests.js
for (let i = 2; i < process.argv.length; i++) {
  arg.push(process.argv[i]);
}

// Manipulate array to fit into the proper format
arg = arg.join('","').split(",")

// Add the companies name mannually to pass as first argument in the body
arg.unshift(companyName);


// Set the body of the POST request
let data = {
  channel: "default",
  chaincode: "usage-tracker-32",
  chaincodeVer: "1.0",
  method: "Log",
  args: arg
};

// Stringify the data object to format for POST request
data = JSON.stringify(data);

function postRequest() {
    axios.post('https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation', data, {
      dataType: 'json',
      withCredentials: true,
      async: true,
      // Body format has to be application/json type
      // Authorization is Base64 encoded OABCS login credentials
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZGllZ29AYXBwby50ZWNoOjEyMzQ1Njc4OUFhLg=='
      },
      proxy: {
        host: '8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com',
        port: 443,
        path: '/restproxy1/bcsgw/rest/v1/transaction/invocation',
      },
      data: data
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    })
}

postRequest();