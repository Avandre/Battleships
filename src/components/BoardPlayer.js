import React, {useState, useEffect} from 'react';
import Square from './Square';
import '../styles/Board.css';
import {isDestroyed, getRandInt} from '../global/functions';


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

  export default BoardPlayer;