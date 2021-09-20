import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  function Board(props) {
    const [squares, setSquares] = useState(Array(10).fill(0).map(row => new Array(10).fill(null)))
    var ships = props.ships;
    var turn = props.turn;
    var gameEnd = props.gameEnd;
    var playerName = props.playerName;

    function handleClick(i, j) 
    {
      if (!gameEnd)
      {
        if (!turn)
        {
          return;
        }
        const squares_copy = squares.slice();
        let output = "";
        if (squares_copy[i][j] != null)
        {
          return;
        }
        if (ships[i][j] !== 0)
        {
          squares_copy[i][j] = 'X';
          if (isDestroyed(ships, squares_copy, i, j))
          {
            //props.addLog("\nThe ship is destroyed!")
            switch (ships[i][j])
            {
              case 1:
                //props.addLog("Enemy 1-square submarine is exterminated!")
                output = "\nEnemy 1-square submarine is exterminated!";
                break;
              case 2:
                //props.addLog("Enemy 2-square destroyer is defeated!")
                output = "\nEnemy 2-square destroyer is defeated!";
                break;
              case 3:
                //props.addLog("Enemy 3-square cruiser is decimated!")
                output = "\nEnemy 3-square cruiser is decimated!";
                break;
              default:
                //props.addLog("Enemy 4-square battleship is vanquished!")
                output = "\nEnemy 4-square battleship is vanquished!";
            }
          }
          if (isEnd())
          {
            console.log("ships, squares")
            console.log(ships)
            console.log(squares)
            props.finishGame("player");
          }
        }
        else 
        {
          squares_copy[i][j] = '*';
          output = " - Miss"
        }
        setSquares(squares_copy);
        console.log(i + " " + j)
        if (output !== " - Miss")
        {
          props.addLog(playerName + " : " + (i+1) + "," + (j+1) + " - Hit" + output)
        }
        else 
        {
          props.addLog(playerName + " : " + (i+1) + "," + (j+1) + output)
        }
        console.log(ships)
        if (squares_copy[i][j] === '*')
        {
          props.passTurn("player");
        }
      }
    }

    function isEnd()
    {
      let flagVictory = true;
      for (let i = 0; i < squares.length; i++)
      {
        for (let j = 0; j < squares.length; j++)
        {
          if (squares[i][j] === null && ships[i][j] !== 0)
          {
            flagVictory = false;
            break;
          }
        }
      }
      return flagVictory;
    }

    return (
      
      <div>
      <ol>
      {squares.map((rows, index) => {
        return (
          <li className="board-row">
          {rows.map((cells, cIndex) => {
           // {renderSquare(index, cIndex)}
           return (<Square
          value={squares[index][cIndex]}
          onClick={() => handleClick(index, cIndex)}
        />)
          })}
          </li>
        );
        
      })}
      </ol>
      </div>
      
    )
    
  }
  
  function BoardPlayer(props) {
    const [squares, setSquares] = useState(Array(10).fill(0).map(row => new Array(10).fill(null)))
    const [priorities, setPriorities] = useState(Array(10).fill(0).map(row => new Array(10).fill(1)))
    var ships = props.ships;
    var turn = props.turn;
    var gameEnd = props.gameEnd;
    const [map, setMap] = useState(JSON.parse(JSON.stringify(props.ships)));

    useEffect(() => {
      takeTurn();
    })


    function sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }

    function takeTurn()
    {
      if (!gameEnd)
      {
        if (turn)
        {
          return;
        }
        sleep(200);

        const squares_copy = squares.slice();
        let targets = assumeTargets(squares_copy);

        let RNG = getRandInt(0, targets.length-1)
        let i = targets[RNG][0];
        let j = targets[RNG][1];
        console.log(RNG, i, j)
        let result = false;   // is end?
        let output = "";
        
        console.log("TURN AI 4 " + turn)
        if (ships[i][j] !== 0)
        {
          squares_copy[i][j] = 'X';
          if (isDestroyed(ships, squares_copy, i, j))
          {
            switch (ships[i][j])
            {
              case 1:
                //props.addLog("Your 1-square submarine is wrecked!")
                output = "\nYour 1-square submarine is wrecked!";
                break;
              case 2:
                //props.addLog("Your 2-square destroyer is annihilated!")
                output = "\nYour 2-square destroyer is annihilated!";
                break;
              case 3:
                //props.addLog("Your 3-square cruiser is destroyed!")
                output = "\nYour 3-square cruiser is destroyed!";
                break;
              default:
                //props.addLog("Your 4-square battleship is demolished!")
                output = "\nYour 4-square battleship is demolished!";
            }
          };
          changePriorities(i, j, 2)
          result = isEnd();
        }
        else 
        {
          squares_copy[i][j] = '*';
          changePriorities(i, j, -1)
          output = " - Miss"
        }
        
        setSquares(squares_copy);
        console.log(i + " " + j + " - AI turn")
        if (output !== " - Miss")
        {
          props.addLog("AI : " + (i+1) + "," + (j+1) + " - Hit" + output)
        }
        else 
        {
          props.addLog("AI : " + (i+1) + "," + (j+1) + output)
        }
        //props.addLog("AI turn: " + i + " " + j)
        mapUpdate();
        console.log(ships)
        if (result)
        {
          console.log("map, ships, squares")
          console.log(map)
          console.log(ships)
          console.log(squares)
          props.finishGame("ai");
        }
        if (squares_copy[i][j] === '*')           
        {
          props.passTurn("ai");
        }
      }
    }

    function isEnd()
    {
      let flagVictory = true;
      for (let i = 0; i < squares.length; i++)
      {
        for (let j = 0; j < squares.length; j++)
        {
          if (squares[i][j] === null && ships[i][j] !== 0)
          {
            flagVictory = false;
            break;
          }
        }
      }
      return flagVictory;
    }

    function mapUpdate() 
    {
      const mapCopy = map.slice();
      for (let i = 0; i < map.length; i++)
      {
        for (let j = 0; j < map.length; j++)
        {
          if (ships[i][j] !== 0 && mapCopy[i][j] !== ships[i][j])
          {
            mapCopy[i][j] = ships[i][j];
          }
          if (squares[i][j] === "*" || squares[i][j] === "X")
          {
            mapCopy[i][j] = squares[i][j];
          }
          else if (map[i][j] === 0)
          {
            map[i][j] = null;
          }
        }
      }
      setMap(mapCopy);
    }

    function assumeTargets(arr)
    {
      let max = -10;
      let targets = [];
      for (let i = 0; i < arr.length; i++)
      {
        for (let j = 0; j < arr.length; j++)
        {
          if (priorities[i][j] > max && arr[i][j] !== '*' && arr[i][j] !== 'X')
          {
            targets = []
            console.log(targets, i, j)
            max = priorities[i][j];
          }
          if (priorities[i][j] === max && arr[i][j] !== '*' && arr[i][j] !== 'X')
          {
            targets.push([i, j])
          }
        }
      }
      console.log(targets);
      return targets;
    }

    function changePriorities(row, col, value)
    {
      const newPriorities = priorities.slice()
      if (row+1 < priorities.length) 
      {
        if (value > 0 && row-1 > 0 && squares[row+1][col] === 'X')
        {
          newPriorities[row-1][col] += value
        }
        newPriorities[row+1][col] += value
      };
      if (col+1 < priorities.length) 
      {
        if (value > 0 && col-1 > 0 && squares[row][col+1] === 'X')
        {
          newPriorities[row][col-1] += value
        }
        newPriorities[row][col+1] += value
      };
      if (col-1 >= 0) 
      {
        if (value > 0 && col+1 < priorities.length && squares[row][col-1] === 'X')
        {
          newPriorities[row][col+1] += value
        }
        newPriorities[row][col-1] += value
      };
      if (row-1 >= 0) 
      {
        if (value > 0 && row+1 < priorities.length && squares[row-1][col] === 'X')
        {
          newPriorities[row+1][col] += value
        }
        newPriorities[row-1][col] += value
      };

      console.log("Priorities!")
      console.log(newPriorities)
      setPriorities(newPriorities);
    }

    return (
      <div>
      <ol>
      {map.map((rows, index) => {
        return (
          <li className="board-row">
          {rows.map((cells, cIndex) => {
           // {renderSquare(index, cIndex)}
           return (<Square
          value={map[index][cIndex]}
        />)
          })}
          </li>
        );
        
      })}
      </ol>
      </div>
    )
  }

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
  

  function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);

  }

  function isDestroyed(sh, battlemap, target_row, target_col)
    {
      let size = sh[target_row][target_col];  // Size of damaged ship
      let shipCells = [[target_row, target_col]];
      console.log("isDestroyed fix v")
      console.log(sh)
      console.log(battlemap)
      for (let i = 0; i < shipCells.length; i++)  // Placing all cells of damaged ship in shipCells array
      {
        if (shipCells[i][0] + 1 < sh.length && sh[shipCells[i][0] + 1][shipCells[i][1]] === size && !check2DArr(shipCells, shipCells[i][0] + 1, shipCells[i][1])) 
        {
          shipCells[shipCells.length] = [shipCells[i][0] + 1, shipCells[i][1]]
        }
        if (shipCells[i][1] + 1 < sh.length && sh[shipCells[i][0]][shipCells[i][1] + 1] === size && !check2DArr(shipCells, shipCells[i][0], shipCells[i][1] + 1)) 
        {
          shipCells[shipCells.length] = [shipCells[i][0], shipCells[i][1] + 1]
        }
        if (shipCells[i][1] - 1 >= 0 && sh[shipCells[i][0]][shipCells[i][1] - 1] === size && !check2DArr(shipCells, shipCells[i][0], shipCells[i][1] - 1)) 
        {
          shipCells[shipCells.length] = [shipCells[i][0], shipCells[i][1] - 1]
        }
        if (shipCells[i][0] - 1 >= 0 && sh[shipCells[i][0] - 1][shipCells[i][1]] === size && !check2DArr(shipCells, shipCells[i][0] - 1, shipCells[i][1])) 
        {
          shipCells[shipCells.length] = [shipCells[i][0] - 1, shipCells[i][1]]
        }
      }
      console.log(shipCells);

      let flagDestroyed = true;
      for (let i = 0; i < shipCells.length; i++)
      {
        if (battlemap[shipCells[i][0]][shipCells[i][1]] !== 'X')
        {
          flagDestroyed = false;
        }
      }

      if (flagDestroyed)  // if all cells of ship are damaged, it is considered destroyed
      {
        shipDestruction(shipCells, battlemap);
        console.log("Destroyed!")
      }

      return flagDestroyed;
    }

    function check2DArr(arr, value, value2) {   // Helps finding all cells of ship
      var result1 = arr.some(object => object[0] === value);
      var result2 = arr.some(object => object[1] === value2);
      return result1 && result2;
    }

    function shipDestruction(ship, battlemap)   // Sets '*' value to all cells adjacent to destroyed ship
    {
      for (let i = 0; i < ship.length; i++)
      {
        for (let row = -1; row < 2; row++)
        {
          for (let col = -1; col < 2; col++)
          {
            if (ship[i][0] + row < battlemap.length && 
                ship[i][0] + row >= 0 &&
                ship[i][1] + col < battlemap.length &&
                ship[i][1] + col >= 0 &&
                !battlemap[ship[i][0] + row][ship[i][1] + col])
            {
              battlemap[ship[i][0] + row][ship[i][1] + col] = '*';
            }
          }
        }
      }
    }
