# Queens Puzzle Solver Chrome Extension

A Chrome extension that automatically solves the n-Queens puzzle with color region constraints. The solver ensures that:

- No two queens can be in the same row, column, or adjacent cells
- Each color region can only contain one queen
- Pre-placed queens are respected in the solution

## Features

- Parses the puzzle grid directly from the webpage
- Automatically solves the puzzle using backtracking algorithm
- Places queens on the board by simulating clicks
- Handles puzzles of different sizes
- Respects existing queens and color region constraints

## Installation

### From Source

1. Clone this repository:

   ```bash
   git clone https://github.com/Akonibrahim/linkedinqueens
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" by clicking the toggle switch in the top right corner

4. Click "Load unpacked" and select the directory containing the extension files

5. The Queens Puzzle Solver extension icon should now appear in your Chrome toolbar

### From Chrome Web Store

_Coming soon_

## Usage

1. Navigate to a webpage containing the n-Queens puzzle

2. Click the Queens Puzzle Solver extension icon in your Chrome toolbar

3. Click the "Solve Puzzle" button in the popup

4. The extension will automatically:

   - Parse the current puzzle state
   - Find a valid solution
   - Place queens on the board by clicking the appropriate cells

## Technical Details

### Files Structure

```
queens-puzzle-solver/
├── manifest.json     # Extension configuration
├── popup.html       # Extension popup interface
├── popup.js         # Popup interaction handling
└── solver.js        # Main puzzle solving logic
```

### Algorithm

The solver uses a backtracking algorithm that:

1. Parses the initial board state including:
   - Pre-placed queens
   - Color regions
   - Board dimensions
2. Tracks constraints:
   - Rows and columns with queens
   - Color regions with queens
   - Adjacent cells to existing queens
3. Recursively tries to place queens while maintaining all constraints
4. Returns the first valid solution found

## Development

### Prerequisites

- Google Chrome browser
- Basic understanding of JavaScript and Chrome extension development

### Local Development

1. Make your changes to the source files
2. Reload the extension in `chrome://extensions/`
3. Test the changes on a puzzle page

### Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Submit a pull request with a clear description of your changes
