// solver.js
(function() {
  function parseColorMatrix() {
    const grid = document.getElementById('queens-grid');
    if (!grid) return null;

    const gridStyle = window.getComputedStyle(grid);
    const rows = parseInt(gridStyle.getPropertyValue('--rows'));
    const cells = grid.querySelectorAll('.queens-cell-with-border');
    
    const matrix = [];
    let row = [];
    
    cells.forEach(cell => {
      // Get color number
      const colorClass = Array.from(cell.classList)
        .find(c => c.startsWith('cell-color-'));
      const colorNum = parseInt(colorClass.split('-').pop());
      
      // Check if cell contains queen
      const queen = cell.querySelector('.cell-input--queen');
      if (queen) {
        row.push(['X', colorNum]);
      } else {
        row.push(colorNum);
      }
      
      if (row.length === rows) {
        matrix.push(row);
        row = [];
      }
    });
    
    return matrix;
  }

  function solvePuzzle(matrix) {
    const size = matrix.length;
    const queens = [];
    const colorRegions = {};

    // Build color regions and find existing queens
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const cell = matrix[i][j];
        const color = Array.isArray(cell) ? cell[1] : cell;
        
        if (Array.isArray(cell) && cell[0] === 'X') {
          queens.push([i, j]);
        }
        
        if (!colorRegions[color]) {
          colorRegions[color] = [];
        }
        colorRegions[color].push([i, j]);
      }
    }

    // Initialize constraint tracking sets
    const rowsWithQueen = new Set(queens.map(q => q[0]));
    const colsWithQueen = new Set(queens.map(q => q[1]));
    const colorsWithQueen = new Set();
    
    for (const [color, cells] of Object.entries(colorRegions)) {
      if (cells.some(cell => queens.some(q => q[0] === cell[0] && q[1] === cell[1]))) {
        colorsWithQueen.add(parseInt(color));
      }
    }

    // Track invalid positions
    const invalidPositions = new Set();
    for (const [qRow, qCol] of queens) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const x = qRow + dx;
          const y = qCol + dy;
          if (x >= 0 && x < size && y >= 0 && y < size) {
            invalidPositions.add(`${x},${y}`);
          }
        }
      }
    }

    function isSafe(row, col, color) {
      return !rowsWithQueen.has(row) &&
             !colsWithQueen.has(col) &&
             !colorsWithQueen.has(color) &&
             !invalidPositions.has(`${row},${col}`);
    }

    function placeQueen(row) {
      if (row === size) return true;
      if (rowsWithQueen.has(row)) return placeQueen(row + 1);

      for (let col = 0; col < size; col++) {
        const cell = matrix[row][col];
        if (Array.isArray(cell) && cell[0] === 'X') continue;
        
        const color = Array.isArray(cell) ? cell[1] : cell;
        
        if (isSafe(row, col, color)) {
          queens.push([row, col]);
          rowsWithQueen.add(row);
          colsWithQueen.add(col);
          colorsWithQueen.add(color);
          
          const newInvalidPositions = [];
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (dx === 0 && dy === 0) continue;
              const x = row + dx;
              const y = col + dy;
              if (x >= 0 && x < size && y >= 0 && y < size) {
                const key = `${x},${y}`;
                if (!invalidPositions.has(key)) {
                  invalidPositions.add(key);
                  newInvalidPositions.push(key);
                }
              }
            }
          }

          if (placeQueen(row + 1)) return true;

          queens.pop();
          rowsWithQueen.delete(row);
          colsWithQueen.delete(col);
          colorsWithQueen.delete(color);
          newInvalidPositions.forEach(pos => invalidPositions.delete(pos));
        }
      }
      return false;
    }

    if (placeQueen(0)) {
      return queens;
    }
    return null;
  }

  async function applySolution(queens) {
    const grid = document.getElementById('queens-grid');
    const cells = Array.from(grid.querySelectorAll('.queens-cell-with-border'));
    const size = Math.sqrt(cells.length);
    
    // Function to simulate a double-click
    function doubleClickCell(cell) {
      return new Promise(resolve => {
        // First click sequence
        cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        cell.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        cell.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        
        // Second click sequence
        cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, detail: 2 }));
        cell.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, detail: 2 }));
        cell.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, detail: 2 }));
  
        // Dispatch dblclick event
        cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window, detail: 2 }));
  
        // Add a small delay before resolving
        setTimeout(resolve, 100);
      });
    }
  
    // Place queens one by one with a delay
    for (const [row, col] of queens) {
      const index = row * size + col;
      const cell = cells[index];
      
      // Only double-click if there isn't already a queen
      if (!cell.querySelector('.cell-input--queen')) {
        console.log(`Placing queen at row ${row}, col ${col}`);
        await doubleClickCell(cell);
      }
    }
  }

  // Main execution
  console.log('Starting puzzle solver...');
  const matrix = parseColorMatrix();
  if (!matrix) {
    alert('Could not find puzzle grid on the page');
    return;
  }

  console.log('Matrix parsed:', matrix);
  const solution = solvePuzzle(matrix);
  if (!solution) {
    alert('No solution found');
    return;
  }

  console.log('Solution found:', solution);
  applySolution(solution).then(() => {
    console.log('Solution application complete');
  }).catch(error => {
    console.error('Error applying solution:', error);
  });
})();