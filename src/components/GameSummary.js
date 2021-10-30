function GameSummary({ words, totalTime}) {
    return (
      <div className="GameSummary">
        <h4>SUMMARY</h4>

        <div>
          <li key="12">Total Words Found: {words.length}</li>
          {words.map((solution) => {return <li key={solution}>{solution}</li>})}
        </div>

        <div>
          <li key="15">Total Time: {totalTime} secs</li>
        </div> 
      </div>
    );
  }
  
  export default GameSummary;
  