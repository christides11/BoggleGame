import React, { useState, useEffect } from 'react';
import {GAME_STATE} from '../services/GameState.js';
import { Button, Form, FloatingLabel} from 'react-bootstrap';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import '../scss/SettingsBar.scss';

function SettingsBar({gameState, setGameState, setSize, setTotalTime, setMaxTime, maxTime}) {

  const [buttonText, setButtonText] = useState("Start Game");
  const [startTime, setStartTime] = useState(0);
  const [timeSelection, setTimeSelect] = useState(0);
  const [boardSizeSelection, setBoardSizeSelect] = useState(3);
  let deltaTime;

  function updateGameState(endTime) {
    if (gameState === GAME_STATE.BEFORE || gameState === GAME_STATE.ENDED) {
      setStartTime(Date.now());
      setGameState(GAME_STATE.IN_PROGRESS);
      setButtonText("End game");
    } else if (gameState === GAME_STATE.IN_PROGRESS) {
      deltaTime = (endTime - startTime)/ 1000.0;
      setTotalTime(deltaTime); 
      setGameState(GAME_STATE.ENDED);
      setButtonText("Start Game");
    }
  }

  const handleChange = (event) => {
    setBoardSizeSelect(parseInt(event.target.value));
    setSize(parseInt(event.target.value));
  };

  const handleTimeChange = (event) => {
    setTimeSelect(parseInt(event.target.value));
    setMaxTime(parseInt(event.target.value));
  };

  const timerProps = {
    isPlaying: true,
    size: 120,
    strokeWidth: 6
  };

  const renderTime = (dimension, time) => {
    return (
      <div className="time-wrapper">
        <div className="time">{time}</div>
        <div>{dimension}</div>
      </div>
    );
  };

  return (
    <div className="SettingsBar" >
      <div className="sbcenter">

      { (gameState === GAME_STATE.BEFORE || gameState === GAME_STATE.ENDED) &&
          <FloatingLabel controlId="floatingSelect" label="time">
            <Form.Select aria-label="Floating label select example" value={timeSelection} onChange={handleTimeChange}>
              <option value="-1">none</option>
              <option value="1">1 minute</option>
              <option value="2">2 minutes</option>
              <option value="3">3 minutes</option>
              <option value="4">4 minutes</option>
              <option value="5">5 minutes</option>
              <option value="6">6 minutes</option>
              <option value="7">7 minutes</option>
            </Form.Select>
          </FloatingLabel>
        }

        <Button variant="outline-primary" onClick={() => updateGameState(Date.now())} >
          {buttonText}
        </Button>

        { (gameState === GAME_STATE.BEFORE || gameState === GAME_STATE.ENDED) &&
          <FloatingLabel controlId="floatingSelect" label="size">
            <Form.Select aria-label="Floating label select example" value={boardSizeSelection} onChange={handleChange}>
              <option value="3">3x3</option>
              <option value="4">4x4</option>
              <option value="5">5x5</option>
              <option value="6">6x6</option>
              <option value="7">7x7</option>
              <option value="8">8x8</option>
              <option value="9">9x9</option>
              <option value="10">10x10</option>
            </Form.Select>
          </FloatingLabel>
        }
      </div>

      <div className="sbcenter">
        { (gameState === GAME_STATE.IN_PROGRESS) && maxTime !== -1 &&
          <CountdownCircleTimer
          {...timerProps}
          duration={maxTime * 60}
          colors={[
            ['#004777', 0.33],
            ['#F7B801', 0.33],
            ['#A30000', 0.33],
          ]}
          onComplete={(totalElapsedTime) => [
            updateGameState(Date.now())
          ]}
          >
          {({ remainingTime }) => renderTime("seconds", remainingTime)}
          </CountdownCircleTimer>
        }
      </div>
    </div>
  );
}

export default SettingsBar;
