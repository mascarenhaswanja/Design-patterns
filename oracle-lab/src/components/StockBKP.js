import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS } from '../quotecontract'

class  Stock extends React.Component {

  async  componentDidMount () {
    try {
        let res = await 
            fetch('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=2DRW2BS7GC61ZGWW')
        let resJson = await res.json();
         
        console.log(resJson["Global Quote"]);
        console.log(resJson["Global Quote"]["05. price"]);
        
        console.log(resJson["Global Quote"]);
        let _symbol = resJson["Global Quote"]["01. symbol"];
        let _price  = resJson["Global Quote"]["05. price"];
        let _volume = resJson["Global Quote"]["06. volume"];    
        this.setState({symbol: _symbol, price: _price, volume: _volume });
 
        const web3 = new Web3("http://localhost:8545");
        const accounts = await web3.eth.getAccounts();
        console.log("Account 0 = ", accounts[0] );

        // contract from ganache by ABI and address
        const stockQuote = new web3.eth.Contract(STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS);
        let resContract = await stockQuote.methods.getStockPrice(web3.utils.fromAscii(
          _symbol, _price, _volume))
          .call();
        console.log(resContract);
    }
    catch(err) {
      console.log("Error: fetch failed")
    }
  }

  render() {
    return (
      <div>
        Symbol: {this.state.symbol}<br/>
        Price:  {this.state.price}<br/>
        Volume: {this.state.volume}<br/>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </div>
    );
  }
}

export default Stock;

 /* constructor() {
    super();
    this.state = { data: [] };
  }
*/
