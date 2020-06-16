var express = require('express');
var router = express.Router();
const Web3 = require('web3'); 
const ABI = require('./abi.json');
const Tx = require('ethereumjs-tx').Transaction;

/* GET home page. */
router.get('/', async function(req, res, next) {
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  var accounts = await web3.eth.getAccounts();
  console.log("Accounts:", accounts);

  //  Deploy in Remix
  const contractAddress = '0x712be6639D50438C0f4EDFEDc1a6736AE56d666b';

  // Account from ganache
  const account = '0xf8b2E8E13f9BDFC2c6E2001584110fc4bA23c377';
  const privateKey = Buffer.from('4e53e46ef9d07fbdcadacfb472d260e4a83356ddc3424b4afff4e2a609b8bc16', 'hex');

  // Param to increment Number - function incNumber(value)
  let value = 50;

  var TestContract = new web3.eth.Contract(ABI, contractAddress);
  const _data = TestContract.methods.incNumber(value).encodeABI();
   
  _nonce = await web3.eth.getTransactionCount(account);

  var rawTx = {
    nonce: _nonce,
    gasPrice: '0x20000000000',
    gasLimit: '0x27511',
    to: contractAddress,
    value: 0,
    data: _data
  }

  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  
  var serializedTx = tx.serialize();
  
  var _receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
  console.log("Receipt: ", _receipt);
    
  res.render('index', { title: 'Express', receipt: JSON.stringify(_receipt) });
});

module.exports = router;
