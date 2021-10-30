import React, { useState } from 'react';
import { Button, Form, FloatingLabel} from 'react-bootstrap';
import '../scss/GuessInput.scss';

function GuessInput({allSolutions, foundSolutions, correctAnswerCallback}) {

  const [labelText, setLabelText] = useState("Make your first guess!");
  const [input, setInput] = useState("");

  function evaluateInput() {
    if (foundSolutions.includes(input)) {
      setLabelText(input + " has already been found!");
    } else if (allSolutions.includes(input)) {
      correctAnswerCallback(input);
      setLabelText(input + " is correct!");
    } else {
      setLabelText(input + " is incorrect!");
    }
  }

  function keyPress(e) {
    if (e.key === 'Enter') {
      e.target.value = "";
      evaluateInput()
    }
  }

  return (
    <div className="GuessInput" >
        <div className="GInput">
            <div>{labelText}</div>
            <Form.Control type="text" placeholder="Make a Guess" onKeyPress={(e) => keyPress(e)} onChange={(event) => setInput(event.target.value)} />
        </div>
    </div>
  );
}

export default GuessInput;
