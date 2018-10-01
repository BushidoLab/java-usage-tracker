require("dotenv").config({path: "../.env"});
const axios = require("axios");


// 
axios.get(`https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction?channel=${process.argv[2]}&txid=${process.argv[3]}`, {
      dataType: 'json',
      withCredentials: true,
      async: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.CREDENTIALS
      }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.log(error);
})