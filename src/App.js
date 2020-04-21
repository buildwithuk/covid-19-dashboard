import React from 'react';
import logo from './logo.svg';
import './App.css';
import MainComponent from './components/main-component';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <div className="heading">
          <p> Covid Data Summary</p>
          <div> Data from <a href="https://rapidapi.com/api-sports/api/covid-193">Rapid API</a></div>
        </div>
        <div className="main-div">
          <MainComponent></MainComponent>
        </div>
      </header>
    </div>
  );
}

export default App;
