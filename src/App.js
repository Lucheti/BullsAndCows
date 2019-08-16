import React from 'react';
import logo from './logo.svg';
import './App.css';
function fillArray(){
    const array = [];
    for (let i = 1; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            for (let k = 0; k < 10; k++) {
                for (let w = 0; w < 10; w++) {
                    if (i !== j && i !== k && i !== w && j !== k && j !== w && k !== w) {
                        array.push([i,j,k,w])
                    }
                }
            }
        }
    }
    return array;
}

function filter(foo , bar){
    const result = [];
    foo.forEach( elemFoo => {
        if(contains(bar , elemFoo)) result.push(elemFoo)
    });
    if (result) return result;
    else return foo;
}
function contains(foo, elem) {
    for (const fooElem of foo){
        if (arraysEqual(elem,fooElem)) return true;
    }
    return false;
}
function arraysEqual(a1,a2) {
    return JSON.stringify(a1)==JSON.stringify(a2);
}
function getAllPosibilities(number , results){
    const answers = [];
    for (let i = 1; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            for (let k = 0; k < 10; k++) {
                for (let w = 0; w < 10; w++) {
                    if (i !== j && i !== k && i !== w && j !== k && j !== w && k !== w) {
                        let okCount = 0;
                        let regCount = 0;
                        if (number[0] === i) okCount++;
                        if (number[1] === j) okCount++;
                        if (number[2] === k) okCount++;
                        if (number[3] === w) okCount++;
                        if (number[0] === j || number[0] === k || number[0] === w) regCount++;
                        if (number[1] === i || number[1] === k || number[1] === w) regCount++;
                        if (number[2] === i || number[2] === j || number[2] === w) regCount++;
                        if (number[3] === i || number[3] === j || number[3] === k) regCount++;
                        if (results[0] === okCount && results[1] === regCount) answers.push([i, j, k, w])
                    }
                }
            }
        }
    }
    return answers;
}
function checkAttempt(attempt, number){
    let regularCount = 0;
    let okCount = 0;
    for (let i in number){
        for (let j in attempt){
            if(i === j){
                if(number[i] === attempt[j]) okCount++;
            }
            else if(number[i] === attempt[j]) regularCount++;
        }
    }
    return[okCount,regularCount,4 - okCount - regularCount];
}
function getNumber(){
    const random = () => {
        return Math.trunc(Math.random() * 10)
    };
    let result = [random() , random(), random(), random()];
    result = result.filter((v,i) => result.indexOf(v) === i);
    if (result[0] === 0 || result.length < 4) return getNumber();
    return result;
}



function App() {
    const [posibleNumbers, setPosibleNumbers] = React.useState(fillArray());
    const [numero, setNumero] = React.useState();
    const [ok, setOk] = React.useState();
    const [reg, setReg] = React.useState();
    const [secret, setSecret] = React.useState();
    const [attempts, setAttempts] = React.useState(["[ number ] --> [ bien , regular , mal ]"] );
    const [showSecret, setShowSecret] = React.useState(true);
    const [mode, setMode] = React.useState(true);


    function handleClick1(){
        const attemptNumber = [];
        const attemptResult = [Number.parseInt(ok), Number.parseInt(reg) , Number.parseInt(4-ok-reg)];
        Array.from(""+numero+"").forEach( n => attemptNumber.push(Number.parseInt(n)));
        setPosibleNumbers(filter(posibleNumbers, getAllPosibilities(attemptNumber, attemptResult)));
    }

    function handleClick(ok,reg){
        const attemptNumber = [];
        const attemptResult = [Number.parseInt(ok), Number.parseInt(reg) , Number.parseInt(4-ok-reg)];
        Array.from(""+numero+"").forEach( n => attemptNumber.push(Number.parseInt(n)));
        setPosibleNumbers(filter(posibleNumbers, getAllPosibilities(attemptNumber, attemptResult)));
    }

    function handleCheck(){
        let attemptNumber = [];
        Array.from(""+numero+"").forEach( n => attemptNumber.push(Number.parseInt(n)));

        const attemptSecret = [];
        Array.from(""+secret+"").forEach( n => attemptSecret.push(Number.parseInt(n)));

        const result = checkAttempt(attemptNumber,attemptSecret);

        setOk(result[0]);
        setReg(result[1]);
        setAttempts([...attempts , (JSON.stringify(attemptNumber) + " --> " + JSON.stringify(result))]);
        return handleClick(result[0],result[1])
    }

    function throwRandom() {
        const asArray = getNumber();
        const asString = ''+asArray[0]+asArray[1]+asArray[2]+asArray[3];
        setSecret(Number.parseInt(asString));
        setShowSecret(false);
    }

    return (
    <div className="App">
      <header className="App-header">
          <div>
              <label>Change Mode: </label>
              <input className={"checkbox"} type={"checkbox"} value={mode} onChange={() => setMode(!mode)}/>
          </div>
          <img src={logo} className="App-logo" alt="logo" />

          {showSecret && mode && <div style={{position: "absolute", top: "5vh", right: "5vw"}} className={"input-group"}>
              <div className={"number-input"}>
                  <label>Optional: </label>
                  <input placeholder={"Secret"} value={secret} onChange={evt => setSecret(evt.target.value)}/>
              </div>
              <button onClick={throwRandom}>Throw random</button>
          </div>}

        <div className={"input-group"}>

            <div className={"number-input"}>
                <input placeholder={"numero"} value={numero} onChange={evt => setNumero(evt.target.value)}/>
            </div>

            {!mode && <div className={"result-input"}>
                <input placeholder={"ok"} value={ok} onChange={evt => setOk(evt.target.value)}/>
                <input placeholder={"reg"} value={reg} onChange={evt => setReg(evt.target.value)}/>
            </div>}

        </div>
          <div style={{display: "flex"}}>
              { mode?
                  <button className={"app-button"} onClick={handleCheck}>Check Attempt</button>:
                  <button className={"app-button"} onClick={handleClick1}>Do Magic</button>
              }
          </div>
          <p>{posibleNumbers.length}</p>
          {posibleNumbers.map( number => (<p>{JSON.stringify(number)}</p>))}
      </header>
        <div className={"top-left"}>
            {attempts.map( s => (<p>{s}</p>))}
        </div>
    </div>
  );
}

export default App;
