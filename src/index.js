import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import Board from './components/Board.js';
import BoardPlayer from './components/BoardPlayer';
import {getRandInt} from './global/functions';


  function Game() {
    const [mode, setMode] = useState("menu");
    const [turnPlayer, setTurnPlayer] = useState(true);
    const [gameEnd, setGameEnd] = useState(false);
    const [playerShips, setPlayerShips] = useState(Array(10).fill(0).map(row => new Array(10).fill(0)))
    const [enemyShips, setEnemyShips] = useState(Array(10).fill(0).map(row => new Array(10).fill(0)))
    const [playerName, setPlayerName] = useState("Bob");
    const [log, setLog] = useState("");

    function passTurn(key)
    {
      if (key === "player")
      {
        setTurnPlayer(false)
      }
      else if (key === "ai")
      {
        setTurnPlayer(true)
      }
      console.log("Turn changed to" + turnPlayer)
    }

    function finishGame(winner)
    {
      if (winner === "player")
      {
        addLog(playerName + " wins!")
        setGameEnd("player");
      }
      else
      {
        addLog("The machine is victorious!")
        setGameEnd("ai");
      }
    }

    function arrangeShips(arrStart, isPlayer) {
      var arr = arrStart.slice();
      autoArrangeShips(arr, 1, 4);
      autoArrangeShips(arr, 2, 3);
      autoArrangeShips(arr, 3, 2);
      autoArrangeShips(arr, 4, 1);

      for (let i = 0; i < arr.length; i++)
      {
        for (let j = 0; j < arr.length; j++)
        {
          if(arr[i][j] === 8) {arr[i][j] = 0}
        }
      }
      if (isPlayer)
      {
        setPlayerShips(arr)
      }
      else 
      {
        setEnemyShips(arr)
        console.log(arr)
      }
    }

    function autoArrangeShips(arr, quantity, size) {
      for (let count = quantity; count > 0; count--) {
        let success = false;
        while (!success)
        {
          let rowRand = getRandInt(0, 9);
          let colRand = getRandInt(0, 9);
          if (isEmpty(rowRand, colRand, arr)) {
            let dirRand = getRandInt(0, 3);
            switch (dirRand) {
              case 3: //up
                if ((colRand >= size-1) && (notOccupied(rowRand, colRand, 0, -1, size, arr))) 
                {
                  placeShip(rowRand, colRand, 0, -1, size, arr)
                  success = true;
                }
                break;
              case 2: //right
                if ((rowRand <= 9 - (size - 1)) && (notOccupied(rowRand, colRand, 1, 0, size, arr))) 
                {
                  placeShip(rowRand, colRand, 1, 0, size, arr)
                  success = true;
                }
                break;
              case 1: //down
                if ((colRand <= 9 - (size - 1)) && (notOccupied(rowRand, colRand, 0, 1, size, arr))) 
                {
                  placeShip(rowRand, colRand, 0, 1, size, arr)
                  success = true;
                }
                break;
              default: //left
                if ((rowRand >= size-1) && (notOccupied(rowRand, colRand, -1, 0, size, arr))) 
                {
                  placeShip(rowRand, colRand, -1, 0, size, arr)
                  success = true;
                }
            }
          }
        }
      }
    }

    function notOccupied(row, col, incRow, incCol, size, arr) {
      let suceess = true;
      for (size; size > 0; size--) {
        if (arr[row][col] !== 0)
        {
        suceess = false;
        }
        row += incRow;
        col += incCol;
      }
      return suceess;
    }

    function isEmpty(row, col, arr)
    {
      if (arr[row][col] === 0)
      return true;
      else return false;
    }

    function placeShip(row, col, incRow, incCol, size, arr)
    {
      const newArr = arr;
      const score = size;
      for (size; size > 0; size--)
      {
        if ((row+1 < arr.length) && (col+1 < arr.length)) {newArr[row+1][col+1] = 8}; //Unavailable for placing
        if ((row+1 < arr.length) && (col-1 > 0)) {newArr[row+1][col-1] = 8};
        if (row+1 < arr.length) {newArr[row+1][col] = 8};
        if (col+1 < arr.length) {newArr[row][col+1] = 8};
        if (col-1 >= 0) {newArr[row][col-1] = 8};
        if ((row-1 >= 0) && (col+1 < arr.length)) {newArr[row-1][col+1] = 8};
        if ((row-1 >= 0) && (col-1 >= 0)) {newArr[row-1][col-1] = 8};
        if (row-1 >= 0) {newArr[row-1][col] = 8};
        newArr[row][col] = score;
        if (size < score) {newArr[row - incRow][col - incCol] = score};
        row += incRow;
        col += incCol;
      }

      arr = newArr;
    }

    function prepareBoards()
    {
      console.log("Hi, " + playerName + "!")
      arrangeShips(playerShips, true);
      arrangeShips(enemyShips, false);
      setMode("game");
    }

    function addLog(text)
    {
      let newLog = log + `\n` + text;
      setLog(newLog)
    }

    function handleNameChange(e)
    {
      setPlayerName(e.target.value);
    }

    function backToMenu()
    {
      setPlayerShips(Array(10).fill(0).map(row => new Array(10).fill(0)));
      setEnemyShips(Array(10).fill(0).map(row => new Array(10).fill(0)));
      setGameEnd(false);
      setTurnPlayer(true);
      setLog("");
      setMode("menu");
    }

    function popupEnd()
    {
      return (
        <div className="popup-wrapper">
          <div className="popup">
            {gameEnd==="player" && "You won!"}
            {gameEnd==="ai" && "You lost!"}
            <button style={{font: '18px "Century Gothic", Futura, sans-serif', marginTop: '10px'}}  onClick={() => backToMenu()}>
            Return to menu
            </button>
          </div>
        </div>
      )
    }
    

    return (
      
      <div>
      {(mode === "game") && 
        <div >
        <div style={{display:'flex', justifyContent:'center'}}>
        {turnPlayer && <label>Your turn, {playerName}!</label>}
        {!turnPlayer && <label>AI turn.</label>}
        </div>
          <div className="game">

          {gameEnd && popupEnd()}
          
          
          <div className="game-board">
            <Board 
              ships={enemyShips}
              turn={turnPlayer}
              gameEnd={gameEnd}
              playerName={playerName}
              passTurn={passTurn}
              addLog={addLog}
              finishGame={finishGame}
            />
          </div>

          <div className="game-board">
          <BoardPlayer
            ships={playerShips}
            turn={turnPlayer}
            gameEnd={gameEnd}
            passTurn={passTurn}
            addLog={addLog}
            finishGame={finishGame}
          />
          </div>

          </div>
          <div className="game-log">
          <button style={{font: '18px "Century Gothic", Futura, sans-serif', marginBottom:'2.5%'}} onClick={() => backToMenu()}>Return to menu</button>
          <div className="log">
          {log}
          </div>
            
          </div>

          
          
        </div>

      }

      {(mode === "menu") && 
        <div>
        <div className="menu-label">
        Battleships
        </div>
        <div className="menu-container">
        <form className="menu-form">
        <label style={{marginRight: '10%', width: '30%'}}>
          Name: 
        </label>
        <input className="menu-textarea" type="text" value={playerName} onChange={handleNameChange} />
        
      </form>
        <button className="menu-button" onClick={() => prepareBoards()}>Play!</button>
        </div>
        </div>
      }
    </div>
      
    );
  }
  
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  

  