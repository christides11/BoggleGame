import React, { useState, useEffect } from 'react';
import {GAME_STATE} from '../services/GameState.js';
import {RandomGrid} from '../services/randomGen.js';
import {BoggleSolver} from '../services/boggle_solver.js';
import { collection, doc, addDoc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import SettingsBar from '../components/SettingsBar.js';
import Board from '../components/Board.js';
import GuessInput from '../components/GuessInput.js';
import FoundSolutions from '../components/FoundSolutions.js';
import GameSummary from '../components/GameSummary.js';
import FirebaseBoardSelect from '../components/FirebaseBoardSelect.js';
import './Boggle.css';

function BogglePage({user, setUser}) {
  const [allSolutions, setAllSolutions] = useState([]);  // solutions from solver
  const [foundSolutions, setFoundSolutions] = useState([]);  // found by user
  const [gameState, setGameState] = useState(GAME_STATE.BEFORE); // Just an enuerator or the three states see below
  const [grid, setGrid] = useState([ ["?", "?", "?"], ["?", "?", "?"], ["?", "?", "?"] ]);   // the grid
  const [totalTime, setTotalTime] = useState(0);  // total time elapsed
  const [maxTime, setMaxTime] = useState(-1); // max time for the game
  const [size, setSize] = useState(3);  // selected grid size
  const [firebaseBoardDoc, setFirebaseBoardDoc] = useState(null);


  // useEffect will trigger when the array items in the second argument are
  // updated so whenever grid is updated, we will recompute the solutions
  useEffect(() => {
    const wordList = require('../full-wordlist.json');
    let tmpAllSolutions = findAllSolutions(grid, wordList.words);
    setAllSolutions(tmpAllSolutions);
  }, [grid]);

  
  // This will run when gameState changes.
  // When a new game is started, generate a new random grid and reset solutions
  useEffect(() => {
      async function FillGrid(){
      if (gameState === GAME_STATE.IN_PROGRESS) {
        const db = getFirestore();
        // Grid not loaded from external source (such as firestore)
        if(firebaseBoardDoc === null){
          // SET RANDOM BOARD AND TRY UPLOADING IT
          let rGrid = RandomGrid(size);
          // Upload board.
          const docRef = doc(db, "GameBoards", rGrid.toString().replaceAll(',', ''));
          await setDoc(docRef, {
            size: size
          });
          // Get board ref back.
          const docSnap = await getDoc(docRef);
          setFirebaseBoardDoc(docSnap);

          setGrid(rGrid);
          setFoundSolutions([]);
        }else{
          // FIREBASE BOARD
          setGrid(firebaseStringTo2DArray(firebaseBoardDoc.id, firebaseBoardDoc.data().size));
          setFoundSolutions([]);
        }
      }
    }
    FillGrid();
  }, [gameState, size, firebaseBoardDoc]);

  function firebaseStringTo2DArray(fstring, s){
    let arr = [];
    for(let i = 0; i < s; i++){
      let innerArr = [];
      for(let j = 0; j < s; j++){
        innerArr.push(fstring[(s * i) + j]);
      }
      arr.push(innerArr);
    }
    return arr;
  }

  function findAllSolutions(grid, words){
    return BoggleSolver(grid, words);
  }

  function correctAnswerFound(answer) {
    setFoundSolutions([...foundSolutions, answer]);
  }

  function uploadLeaderboardScore(timeTaken){
    if(user == null) return;
    if(foundSolutions.length === 0) return;
    if(firebaseBoardDoc === null) return;
    const db = getFirestore();
    
    addDoc(collection(db, "LeaderBoard"), {
      playerName: user.displayName,
      solvedTime: timeTaken,
      theBoard: firebaseBoardDoc.ref,
      numFound: foundSolutions.length
    });
    setFirebaseBoardDoc(null);
  }

  return (
    <div className="BogglePage">

      <div className="Content">
        <SettingsBar gameState={gameState}
                       setGameState={(state) => setGameState(state)} 
                       setSize={(state) => setSize(state)}
                       setTotalTime={(state) => setTotalTime(state)}
                       setMaxTime={(state) => setMaxTime(state)}
                       maxTime={maxTime}
                       numFound={foundSolutions.length}
                       theGrid={JSON.stringify(grid)}
                       setGrid={(state) => setGrid(state)}
                       setFirebaseBoardDoc={setFirebaseBoardDoc}
                       uploadLeaderboardScore={uploadLeaderboardScore} />
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

export default BogglePage;
