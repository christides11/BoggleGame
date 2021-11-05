import React, { useState, useEffect } from 'react';
import Main from './components/main';
import './App.css';

function App(){

  console.log("APP RENDER");
  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;