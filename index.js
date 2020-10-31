const cron = require('node-cron');
const express = require('express');
const axios = require('axios');
var dateTimeNow = new Date();
var dateTimeNowEpoch = Date.now();
const apiKeyToken = 'R7GSKSJUHSTF3UQGMD8VSZIIMT1FZNJ551'
const address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
var transaction = {
  blockHash: "",
  timeStamp: "",
  value: ""
};
var transactionList = [];


app = express();


// Schedule tasks to be run on the server (every minute).
cron.schedule('* * * * *', function () {
  console.log('running a task every minute');
  axios.get('https://api.etherscan.io/api?module=account&action=txlist&address=' + address + '&startblock=0&endblock=99999999&sort=asc&apikey=' + apiKeyToken)
    .then(response => {
      transactionList = [];
      for (i in response.data.result) {
        if (response.data.result[i].timeStamp >= dateTimeNowEpoch) {
          if (response.data.result[i].value.toString().length > 10) {
            console.log(response.data.result[i]);
            var epochValue = response.data.result[i].timeStamp;
            var epochValueConverted = new Date(0);
            epochValueConverted.setSeconds(epochValue);
            transaction.blockHash = response.data.result[i].blockHash;
            transaction.timeStamp = epochValueConverted;
            transaction.value = response.data.result[i].value + " ETH";
            transactionList.push(transaction);
            transaction = {
              blockHash: "",
              timeStamp: "",
              value: ""
            };
          }
        }

      }
      if (transactionList.length != 0)
        console.log(transactionList);
      else
        console.log("No new transactions founds :(");


    })
    .catch(error => {
      console.log(error);
    });
});



app.listen(3000, () => {
  console.log("Server started at : ");
  formattedDateTimeNow(dateTimeNow);
  console.log("******************************");
  console.log("Ethereum address : (" + address + ") ===> Searching for new transactions ...");

});

//Format a date to "dd/mm/yyyy hh:mm:ss"
function formattedDateTimeNow(dateTimeNow_param) {
  console.log(`${
    (dateTimeNow.getMonth() + 1).toString().padStart(2, '0')}/${
    dateTimeNow.getDate().toString().padStart(2, '0')}/${
    dateTimeNow.getFullYear().toString().padStart(4, '0')} ${
    dateTimeNow.getHours().toString().padStart(2, '0')}:${
    dateTimeNow.getMinutes().toString().padStart(2, '0')}:${
    dateTimeNow.getSeconds().toString().padStart(2, '0')}`);
}