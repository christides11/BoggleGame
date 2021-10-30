function FoundSolutions({ words, headerText}) {
  return (
    <div className="FoundSolutions">
      {words.length > 0 &&
        <h4>{headerText}: {words.length}</h4>
      }
      <ul>
        {words.map((solution) => {return <li key={solution}>{solution}</li>})}
      </ul>
    </div>
  );
}

export default FoundSolutions;
