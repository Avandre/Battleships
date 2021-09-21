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

    export { 
        getRandInt,
        isDestroyed,
        check2DArr
    };