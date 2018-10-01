require("dotenv").config({path: "../.env"});
const axios = require("axios");

let data = {
  channel: "default",
  chaincode: "end2end-05",
  chaincodeVer: "1.0",
  method: "queryLog",
  args: [process.argv[2]]
};

data = JSON.stringify(data);

axios.post('https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation', data, {
      dataType: 'json',
      withCredentials: true,
      async: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.CREDENTIALS
      },
      proxy: {
        host: '8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com',
        port: 443,
        path: '/restproxy1/bcsgw/rest/v1/transaction/invocation',
      },
      data: data
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.log(error);
})