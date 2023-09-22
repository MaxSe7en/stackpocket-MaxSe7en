const drawNumbers = [
  [5, 2, 3, 7, 5],
  [5, 7, 3, 7, 5],
  [5, 2, 3, 7, 5],
  [1, 2, 3, 4, 6],
  [1, 2, 3, 5, 6],
  [6, 2, 4, 6, 6],
  [6, 6, 4, 6, 6],
  [1, 3, 4, 5, 6],
  [2, 3, 4, 6, 6],
  [9, 2, 4, 6, 6],
  [9, 3, 4, 5, 6],
  [4, 0, 4, 5, 1],
  [9, 7, 5, 5, 6],
  [9, 9, 4, 8, 6],
  [8, 3, 5, 5, 6],
  [9, 3, 5, 5, 2],
  [6, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 6, 5, 5, 6],
  [9, 6, 5, 5, 6],
  [9, 6, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 3, 5, 5, 6],
  [9, 7, 5, 5, 6],
  [9, 7, 5, 5, 6],
  [9, 7, 5, 5, 6],
  [9, 7, 5, 5, 6],
  [9, 2, 5, 5, 6],
  [9, 2, 5, 5, 6],
  [9, 2, 5, 5, 6],
  [9, 2, 5, 5, 6],
  [9, 2, 5, 5, 6],
  [9, 2, 5, 5, 6],
  [9, 2, 5, 5, 6],
  [9, 2, 5, 5, 6],
  [9, 2, 5, 5, 6],
];

function analyzeDraw1(drawNumbers, whatToAnalyze) {
  const results = {
    smallBig: [], // Add an array to store detailed dragon-tiger-tie counts
  };

  let prevBigSmall;

  for (const element of drawNumbers) {
    const draw = element;

    let ball;

    ball = draw[parseInt(whatToAnalyze) - 1];

    let bigSmall = getBigSmallForBall(ball);

    // Update counts
    updateCount(bigSmall, results.smallBig, prevBigSmall);

    // Update prev values
    prevBigSmall = bigSmall;
  }

  return results;
}

function updateCount(value, results, prev) {
  if (prev === undefined || value !== prev) {
    results.push(1);
  } else {
    results[results.length - 1]++;
  }
}

function getBigSmallForBalls(ball) {
  return ball >= 0 && ball <= 4 ? "small" : "big";
}

function getBigSmallForBall(ball) {
  return ball >= 0 && ball <= 4 ? "S" : "B";
}
function analyzeDraw(drawNumbers, whatToAnalyze) {
  const results = {
    smallBig: [], // Add an array to store detailed dragon-tiger-tie counts
  };

  let prevBigSmall;

  for (const element of drawNumbers) {
    const draw = element;

    let ball;

    ball = draw[parseInt(whatToAnalyze) - 1];

    let bigSmall = getBigSmallForBall(ball);

    // Add the bigSmall value to the results array
    results.smallBig.push(bigSmall);

    // Update prev values
    prevBigSmall = bigSmall;
  }

  return results;
}
// function analyzeDraw(drawNumbers, whatToAnalyze) {

//     const results = {
//         tree: []
//     };

//     let x = 0;
//     let y = 1;
//     let trunkHeight = 0;

//     let prevType;

//     for (const element of drawNumbers) {

//         const draw = element;

//         const ball = draw[parseInt(whatToAnalyze) - 1];

//         const type = getBigSmallForBall(ball);
//         console.log("type", type, "prevType", prevType)
//         if (prevType === undefined) {
//             y = 0;
//         } else if (prevType !== type) {
//             // Transition - increment x
//             x++;
//         }

//         if (type === "B") {
//             console.log("B", x, y)
//             y++;
//             results.tree.push([x, y, "B"]);
//             trunkHeight++;
//         } else {

//             results.tree.push([x, y, "S"]);
//         }

//         prevType = type;

//     }

//     return results;

// }
// const tree = [
//     [0, 0, "S"],
//     [1, 0, "S"],
//     [2, 0, "S"],
//     [3, 0, "S"],
//     [0, 1, "B"],
//     [1, 1, "B"],
//     [2, 1, "B"],
//     [3, 1, "B"],
//     [4, 1, "B"],
//     [5, 1, "B"],
//     [6, 1, "B"], //START BRANCHING
//     [6, 2, "B"],
//     [6, 3, "B"],
//     [0, 2, "S"],
//     [1, 2, "S"],
//     [2, 2, "S"],
//     [3, 2, "S"],
//     [4, 2, "S"],
//     [5, 2, "S"],
//     [5, 3, "S"],
//     [5, 4, "S"],
//     [6, 4, "S"],
//     [0, 3, "B"],
//     [1, 3, "B"],
//     [2, 3, "B"],
//     [3, 3, "B"],
//     [4, 3, "B"],
//     [4, 4, "B"],
//     [4, 5, "B"],
//     [5, 5, "B"],
//     [6, 5, "B"],
//     [6, 6, "B"],
//     [6, 7, "B"],
//     [6, 8, "B"],
//     [0, 4, "S"],
//     [1, 4, "S"],
//     [2, 4, "S"],
//     [3, 4, "S"],
//     [3, 5, "S"],
//     [3, 6, "S"],
//     [4, 6, "S"],
//     [5, 6, "S"],
//     [5, 7, "S"],
// ];

function buildTree(drawNumbers, whatToAnalyze) {
  const tree = [];
//   const analyzedResults = analyzeDraw(drawNumbers, whatToAnalyze).smallBig;
  const analyzedResults = [
    'S', 'B', 'S', 'S', 'S', 'S', 'B', 'S',
    'S', 'S', 'S', 'S', 'B', 'B', 'S', 'S',
    'S', 'S', 'S', 'S', 'S', 'S', 'S', 'B',
    'B', 'B',
    //  'S', 'S', 'S', 'S', 'S', 'S',
    // 'S', 'S', 'S', 'B', 'B', 'B', 'B', 'S',
    // 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S' 
  ]

  const previousValues = new Map();
//   console.log("seeee",analyzedResults);
  let row = 0;
  let col = 0;
  let whenColIncreaseByMaxRows = 0;
  let tp = {};
  let stop =[]
  let breakingPoint ={}

  analyzedResults.forEach((value, i) => {
    let previousLetter = analyzedResults[i - 1];
    let currentLetter = analyzedResults[i];
    let nextLetter = analyzedResults[i + 1];
    let newItem = [];

    if (currentLetter !== previousLetter) {
      col = whenColIncreaseByMaxRows;

    }
    
    // '0|0': 'S',
    // '0|1': 'B',
    // '3|2': 'S',
    // '0|3': 'B',
    // '4|4': 'S',
    // '1|5': 'B',
    // '5|9': 'S'
    // console.log("currentLetter", currentLetter, "previousLetter", previousLetter, "nextLetter", nextLetter);
    if (previousLetter !== undefined && currentLetter !== previousLetter) {
        stop.push([row,col,currentLetter])
        // stop.push(tree[tree.length-1])
        // let breakingValue = tree[tree.length-1]
        // breakingPoint[(breakingValue[0] + "|" + breakingValue[1])] = breakingValue[2]
        row = 0;
        col++;
        
        if (row === 0) {
            whenColIncreaseByMaxRows = col;
        }
    } else if (currentLetter === previousLetter) {
       

      // let shouldAddTree = tree.some((item) => {
      //     // console.log(item)
      //     return item[0] === row && col - item[1] === 1 && item[2] === currentLetter;

      // });

      // console.log("shouldAddTree", shouldAddTree, "row", row, "col", col, "currentLetter", currentLetter)
      row++;
    } else if (
      currentLetter !== previousLetter &&
      currentLetter !== nextLetter
    ) {
        stop.push([row,col,currentLetter])
      col = 0;
      whenColIncreaseByMaxRows = col;
    }

    if (row > 5) {
      row = 5;
      col++;
    }

    let duplicate = tree.some(
        (item) => item[0] === newItem[0] && item[1] === newItem[1] //&&
        //   item[2] === newItem[2]
      );

    let prevCol = col - 1;
    let nextCol = col + 1;
    const prev = tp[(row + "|" + prevCol)];
    const next = tp[(row + "|" + nextCol)];
    // console.log("rowssss",(row + "|" + col))
    let breakingPointKey = ((row + "|" + col))
    // console.log("typeee", breakingPoint)

    // console.log("cellls",[row,col,breakingPointKey])
    
    let checkBreakingPointExists = breakingPoint.hasOwnProperty('5|9')
    // console.log([row,col],checkBreakingPointExists)
    const spaceRequired =  (prev === currentLetter && next === undefined);
    // console.log("nextttttttt",[prev,next], currentLetter,[row,col]);
    // console.log("spaceRequired",spaceRequired,[row,col],[prev,currentLetter,next])
    // console.log("row", row, "col", col, "currentLetter", currentLetter);

   
    newItem = [row, col, currentLetter];

    if (duplicate) {
    //   if (spaceRequired) {
    //     // console.log("spaceRequired", spaceRequired, [row, col]);
    //   }
      row--;
      col++;
      newItem = [row, col, currentLetter];
    }
    // if()

    tp[row + "|" + col] = currentLetter;
    tree.push(newItem);
    //   // Check if the value already exists in the tree
    //   const key = currentLetter === previousLetter ? `${row}-${col}-${currentLetter}` : `${row}-${col}` ;

    //   if (previousValues.has(key)) {
    //     // Reduce the row by one and increase the col by one
    //     const existingRow = previousValues.get(key);
    //     console.log("existingRow", existingRow, key)
    //     // Adjust the row to be one less than the existing row
    //     row-- //= existingRow - 1;
    //     col++;
    //   }

    // tree.push([row, col, currentLetter]);

    // Store the current value in the previousValues map
    //   previousValues.set(key, true);
  });
//   console.log(previousValues);
//   console.log("tp", tp);
  console.log("stop", stop);
//   console.log("breakingPoint", breakingPoint);
  // Create a Set to store unique elements
  // const uniqueSet = new Set();

  // // Create a new array to store unique elements
  // const uniqueArray = [];

  // // Iterate through the original data and add unique elements to the Set
  // tree.forEach(item => {
  //     const stringifiedItem = JSON.stringify(item); // Convert the sub-array to a string
  //     if (!uniqueSet.has(stringifiedItem)) {
  //         uniqueSet.add(stringifiedItem);
  //         uniqueArray.push(JSON.parse(stringifiedItem)); // Convert the string back to an array
  //     }
  // });
  // console.log(uniqueArray)
//   console.log(tree);
  return tree;
}

const trees = buildTree(drawNumbers, "2nd");
// console.log(trees);

function analyzeDrawssdfsdf(drawNumbers, whatToAnalyze) {
  const results = {
    tree: [],
  };

  let x = 0;
  let y = 0;
  let trunkHeight = 0;

  for (const element of drawNumbers) {
    // Restart trunk height after it reaches 5
    if (trunkHeight >= 5) {
      x = 0;
      y = 0;
      trunkHeight = 0;
    }

    const draw = element;

    let ball;

    ball = draw[parseInt(whatToAnalyze) - 1];

    let bigSmall = getBigSmallForBall(ball);

    if (bigSmall === "B") {
      results.tree.push([x, y, "B"]);
      y++;
      trunkHeight++;
    } else {
      results.tree.push([x, y, "S"]);
    }

    x++;
  }

  return results;
}

analyzeDraw(drawNumbers, "2nd");
// console.log(analyzeDraw(drawNumbers, "2nd"));


    // [5, 6, "S"],
    // [5, 7, "S"],
    // let bbb = [];

    // let shouldAdd = tree.some((item) => {
    //     // console.log(item)
    //     return item[0] === newItem[0] && newItem[1] - item[1] === 1 && item[2] === newItem[2];

    // });

    // console.log("shouldAdd", shouldAdd);
    // if (shouldAdd) {
    //     // row++;
    //     console.log("before ", newItem);

    //     // row--;
    //     col++;
    //     newItem = [row, col, currentLetter];
    //     console.log("after ",newItem);
    // }