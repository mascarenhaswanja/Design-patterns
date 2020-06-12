import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS } from '../quotecontract'

function Stock() {
// state variables
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState(0);
  const [volume, setVolume] = useState(0);
  const [oraclePrice, setOraclePrice] = useState("");
  const [oracleVolume, setOracleVolume] = useState("Not Defined");

  useEffect(() => {}, [symbol]);

  // From API  
  const getApi = () => {
      fetch(
        //"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=2DRW2BS7GC61ZGWW")
        "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=2DRW2BS7GC61ZGWW")
      .then((res) => res.json())
      .then((data) => {
          setSymbol(data["Global Quote"]["01. symbol"]);
          setPrice(data["Global Quote"]["05. price"]);
          setVolume(data["Global Quote"]["06. volume"]);
          console.log(data);
      })
      .catch((err) => {
        console.log("Error: fetch failed: ", err);
        setPrice(0);
        setVolume(0);
      });
  };

  //Setting smart contract
  const setInfoOracle = async () => {
    // ganache-cli -d:  using first available account
    const web3 = new Web3("http://localhost:8545");
    let accounts = await web3.eth.getAccounts();
    let owner =  accounts[0];

    // setStock - contract from ganache by ABI and address
    let stockQuote = new web3.eth.Contract(STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS);
    const resContract = await stockQuote.methods.setStock
    (web3.utils.fromAscii(symbol),
    Number(price) * 10000, Number(volume))
    .send( { from: owner });
    
    if (resContract) {
        console.log("blockHash", resContract);
    } else {
        console.log("Error: setInfoOracle")
    }  
  };

  // Call from Oracle
  // Read back and display results
    const getInfoOracle = async () => {
   // ganache-cli -d:  using first available account
      const web3 = new Web3("http://localhost:8545");
      let accounts = await web3.eth.getAccounts();
      let owner =  accounts[0];
  
      // contract from ganache by ABI and address
      let stockQuote = new web3.eth.Contract(STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS);

      await stockQuote.methods.getStockPrice
           (web3.utils.fromAscii(symbol))
      .call({ from: owner })
      .then((oraclePrice) => {
        setOraclePrice(Number(oraclePrice) / 10000);
      });

      await stockQuote.methods.getStockVolume
            (web3.utils.fromAscii(symbol))
      .call( { from: owner } )
      .then((oracleVolume) => {
        setOracleVolume(Number(oracleVolume));
      });
              
      /*if (resContract) {
          console.log("blockHash", resContract);
          console.log(`Contract address: ${STOCK_ORACLE_ADDRESS}`);
      } else {
          console.log("Error: getStock");
      }  */
  };

    
  return (
      <div>
        <h1>Oracle - Stock</h1>
        <input type="text" placeholder="Symbol to fetch"
              onChange={(event) => setSymbol(event.target.value)}>
        </input>
        <hr/>
        <button onClick={getApi}>From API</button>
        <p>
          Symbol: {symbol} <br/>
          Price : {price}  <br/>
          Volume: {volume}
        </p>
        <hr/>
        <button onClick={setInfoOracle}>Set Oracle</button>
        <hr/>
        <button onClick={getInfoOracle}>Get Oracle</button>
        <p>
          Symbol: {symbol} <br/>
          Oracle Price : {oraclePrice} <br/>
          Oracle Volume: {oracleVolume}
        </p>
      </div>
  );
}
export default Stock;
 