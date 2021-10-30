import React, { useState, useEffect } from 'react';
import {GAME_STATE} from './services/GameState.js';
import {RandomGrid} from './services/randomGen.js';
import {BoggleSolver} from './services/boggle_solver.js';
import NavBar from './components/Navbar.js';
import SettingsBar from './components/SettingsBar.js';
import Board from './components/Board.js';
import GuessInput from './components/GuessInput.js';
import FoundSolutions from './components/FoundSolutions.js';
import GameSummary from './components/GameSummary.js';
import './App.css';

function App() {
  const [allSolutions, setAllSolutions] = useState([]);  // solutions from solver
  const [foundSolutions, setFoundSolutions] = useState([]);  // found by user
  const [gameState, setGameState] = useState(GAME_STATE.BEFORE); // Just an enuerator or the three states see below
  const [grid, setGrid] = useState([ ["?", "?", "?"], ["?", "?", "?"], ["?", "?", "?"] ]);   // the grid
  const [totalTime, setTotalTime] = useState(0);  // total time elapsed
  const [maxTime, setMaxTime] = useState(-1); // max time for the game
  const [size, setSize] = useState(3);  // selected grid size

  // useEffect will trigger when the array items in the second argument are
  // updated so whenever grid is updated, we will recompute the solutions
  useEffect(() => {
    const wordList = require('./full-wordlist.json');
    let tmpAllSolutions = findAllSolutions(grid, wordList.words);
    setAllSolutions(tmpAllSolutions);
  }, [grid]);

  
  // This will run when gameState changes.
  // When a new game is started, generate a new random grid and reset solutions
  useEffect(() => {
    if (gameState === GAME_STATE.IN_PROGRESS) {
      setGrid(RandomGrid(size));
      setFoundSolutions([]);
    }
  }, [gameState, size]);

  function findAllSolutions(grid, words){
    return BoggleSolver(grid, words);
  }

  function correctAnswerFound(answer) {
    console.log("New correct answer:" + answer);
    setFoundSolutions([...foundSolutions, answer]);
  }

  return (
    <div className="App">
      <NavBar/>

      <div className="Content">
        <SettingsBar gameState={gameState}
                       setGameState={(state) => setGameState(state)} 
                       setSize={(state) => setSize(state)}
                       setTotalTime={(state) => setTotalTime(state)}
                       setMaxTime={(state) => setMaxTime(state)}
                       maxTime={maxTime}/>
        <Board board={grid} />
        <hr/>

        { gameState === GAME_STATE.IN_PROGRESS &&
          <div>
            <GuessInput allSolutions={allSolutions}
                      foundSolutions={foundSolutions}
                      correctAnswerCallback={(answer) =>        
                      correctAnswerFound(answer)}/>
            <FoundSolutions headerText="Solutions you've found" words={foundSolutions}/>
          </div>
        }
        { gameState === GAME_STATE.ENDED &&
          <div>
            <GameSummary words={foundSolutions} totalTime={totalTime} />
            <FoundSolutions headerText="Missed Words [wordsize > 3]: " words={allSolutions.filter(function(x) { return foundSolutions.indexOf(x) < 0; })}  />
          </div>
        }
      </div>
    </div>
  );
}

export default App;
