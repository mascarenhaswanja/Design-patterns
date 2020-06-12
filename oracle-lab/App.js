import React from 'react';
import './App.css';

import OracleStock from './components/OracleStock';

class App extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <>
        <OracleStock />
      </>
    )
  }
}

export default App;
