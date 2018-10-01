require("dotenv").config({path: "../.env"});
const axios = require("axios");

let data = {
  channel: "default",
  chaincode: "end2end-05",
  chaincodeVer: "1.0",
  method: "query",
  args: ["oracle"]
};

data = JSON.stringify(data);

axios.post('https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/query', data, {
      dataType: 'json',
      withCredentials: true,
      async: true,
      // Body format has to be application/json type
      // Authorization is Base64 encoded OABCS login credentials
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.CREDENTIALS
      },
      proxy: {
        host: '8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com',
        port: 443,
        path: '/restproxy1/bcsgw/rest/v1/transaction/query',
      },
      data: data
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.log(error);
})