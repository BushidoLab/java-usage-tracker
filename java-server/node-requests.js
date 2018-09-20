const axios = require("axios");

let arg = [1,2,3,4,5,6,7,8,9];

let data = {
  channel: "default",
  chaincode: "usage-tracker-29",
  chaincodeVer: "1.0",
  method: "Log",
  args: [arg[0], arg[1], arg[2], arg[3], arg[4], arg[5], arg[6], arg[7], arg[8]]  
};

function postRequest() {
    axios.post('https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation', data, {
      dataType: 'json',
      withCredentials: true,
      async: true,
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