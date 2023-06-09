import { mainStateProvider } from "@/StateContex";
import { ACTION_TYPES } from "@/games/5d/stateActions";
import { GameData } from "@/interfaces/reducer";




export let intervalMinutes: number = 1;
// let drawData: any = {};

export let gameData: Partial<GameData> = {
  uid: 0,
  gameId: 0,
  unitStaked: 0,
  totalBetAmt: 0,
  multiplier: 1,
  totalBets: 0,
  betId: "",
  allSelections: [],
  userSelections: "",
  gameType: "",
};

//here to be deleted by Richard
// let drawData = {
//   betId: "202305041362",
//   drawDatetime: "2023-05-04 23:42:00",
//   drawNumber: [8, 7, 4, 1, 0],
//   timeLeft: 34,
//   nextBetId: "202305041363",
//   nextDrawDatetime: "2023-05-04 23:43:00",
// };
/**
 * Selects the function to use for a given game.
 * 
 * @param game - The game object to determine the function for.
 * @returns The function to use for the game.
 */
export function gameFunctionSelector(game: any): any {
  if (game.name === "group60" || game.name === "group30") {
    return allSelections;
  }
}

/**
 * Limits the length of the text and appends ellipsis if necessary.
 * @param text - The text to limit.
 * @param limit - The maximum length of the text.
 * @returns The limited text with ellipsis if necessary.
 */
export function limitText(text: any, limit: number) {
  if (text.length > limit) {
    text = text.substring(0, limit - 3) + "...";
  }
  return text;
}

/**
 * Formats time in seconds to HH:MM:SS format.
 * @param time - The time in seconds.
 * @returns The formatted time string in HH:MM:SS format.
 */
export const formatTime = (time: any) => {
  const hours = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Converts seconds to minutes.
 * @param sec - The time in seconds.
 * @returns The time in minutes.
 */
export const convertSecToMin = (sec: any) => {
  return sec / 60;
};
/**
 * fixes some rounding off multiplication errors in javascript. eg. 0.356 *10 gives 3.5599999999999996 in javascript. function returns 3.56 in such case.
 * @param {number} value data to fix
 * @returns correct value after javascript multiplication.
 */
export const fixArithmetic = (value: any): number => +value.toFixed(8);

/**
 * gets time in HH:MM:SS format
 * @param {string} dateInput dateTime to return time from
 * @returns time in HH:MM:SS format
 */
export const getTime = (dateInput: string) => {
  let date = new Date(dateInput);
  return (
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0") +
    ":" +
    String(date.getSeconds()).padStart(2, "0")
  );
};

/**
 * gets date in YYYY-MM-DD format
 * @param {string} date datetime to return date from
 * @returns date in YYYY-MM-DD format
 */
export const getDate = (date: string): string => {
  let dateObj = new Date(date);
  return (
    dateObj.getFullYear() +
    "-" +
    String(dateObj.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(dateObj.getDate()).padStart(2, "0")
  );
};
/**
 * gets the next bet id from the current one. Bet id is of the form '202501260002'(YYYYMMDD+IDDD)
 * @param {string} currentBetId the current bet id eg '202501260002'
 * @param {string} idDateTime the date time '@currentBetId' was generated
 * @param {number} intervalMinutes interval of generation. useful in restarting bet generation on next day
 * @returns next bet id
 */
export function generateNextBetId(
  currentBetId: string,
  idDateTime: string,
  intervalMinute = intervalMinutes
): string {
  let startId: number = 1;
  let appendedId: number = +String(currentBetId).slice(-4);
  let nextGenerationDateTime: Date = addMinutes(idDateTime, intervalMinute);
  let id: number = isNextDay(idDateTime, "" + nextGenerationDateTime)
    ? startId
    : +appendedId + 1;
  return getBetId(nextGenerationDateTime, id);
}

/**
 * Generates the draw periods based on the current bet ID, ID date time, and main time left.
 * @param currentBetId The current bet ID.
 * @param idDateTime The ID date time.
 * @param mainTimeLeft The main time left in seconds.
 * @returns An array of generated draw periods.
 */
export function generateDrawPeriods(currentBetId: string, idDateTime: string, mainTimeLeft: number) {
  let drawPeriodsArr = [];
  let intervalMinutes = convertSecToMin(mainTimeLeft);

  for (let i = 0; i < 3; i++) {
    currentBetId = generateNextBetId(
      currentBetId,
      idDateTime,
      intervalMinutes
    );
    idDateTime = "" + addMinutes(idDateTime, intervalMinutes);
    drawPeriodsArr.push(currentBetId);
  }
  // console.log("drawlist:", drawPeriodsArr);
  return drawPeriodsArr;
}

/**
 * appends bet id to datetime provided.
 * @param {string} dateInput draw date time
 * @param {string} id the id of the draw. counted from '1' at the beginning of the day.
 * @returns formatted bet id
 */
function getBetId(dateInput: Date, id: number): string {
  let date: Date = new Date(dateInput);
  return (
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0") +
    String(id).padStart(4, "0")
  );
}

/**
 * checks whether dates provided happens on different dates
 * @param {string} checkDate does this date happens on the next day?
 * @param {string} date control date. date to be compared to. Default value is "2023-03-08"
 * @returns true or false. true if nextDay
 */
export function isNextDay(checkDate: string, date: string): boolean {

  const date1 = new Date(date);
  const date2 = new Date(checkDate);
  if (date1.getDate() !== date2.getDate()) {
    return true;
  }
  return false;
}

/**
 * Checks if a given betId is the current bet.
 * @param {string} betId - The betId to check.
 * @param {string} currentBetId - The current betId to compare against. Default is serverDrawNum.nextBetId.
 * @returns {boolean} - Returns true if the given betId is the current bet, false otherwise.
 */
export function isCurrent(betId: string, currentBetId: string): boolean {
  // console.log("betId", betId, "currentBetId", currentBetId)
  return betId == currentBetId;
}

/**
 * add some minutes to dateTime provided.
 * @param {string} dateInput dateTime to add minutes to
 * @param {number} minutes minutes to add. can be negative or positive.
 * @returns new dateTime with minutes added. format 'YYYY-MM-DD HH:MM:SS'
 */
export function addMinutes(
  dateInput: string,
  minutes: number = intervalMinutes
) {
  let date = new Date(dateInput);
  return new Date(date.getTime() + minutes * 60000);
}
/**
 * Splits an array of numbers into smaller arrays based on their properties,
 * and returns an object containing these arrays.
 *
 * @param {number} start - The starting index for selecting numbers from the array.
 * @param {number} end - The ending index for selecting numbers from the array.
 * @param {number[]} numbers - The array of numbers to split.
 * @returns {Object} An object containing the following arrays:
 * - small: An array of numbers smaller than the middle number in the selected range.
 * - big: An array of numbers larger than the middle number in the selected range.
 * - even: An array of even numbers in the selected range.
 * - odd: An array of odd numbers in the selected range.
 * - all: An array containing all numbers in the selected range.
 * - buttons: An array containing only the selected range of numbers.
 */
export function splitNumbers(
  start: number,
  end: number,
  numbers: Readonly<number[]>
): any {
  const buttons = numbers.slice(start, end + 1);
  const small = buttons.slice(0, buttons.length / 2);
  const big = buttons.slice(buttons.length / 2, buttons.length);
  const even = buttons.filter((number: number) => number % 2 === 0);
  const odd = buttons.filter((number: number) => number % 2 !== 0);
  const all = numbers.slice(start, end + 1);

  return { small, big, even, odd, all, buttons };
}


/**
 * Converts a Date object to a formatted date-time string.
 * @param date - The Date object to convert.
 * @returns The formatted date-time string in the format "YYYY-MM-DD HH:MM:SS".
 */
export function getDateTime(date: Date) {
  date = new Date(date);
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0") +
    " " +
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0") +
    ":" +
    String(date.getSeconds()).padStart(2, "0")
  );
}


/**

* Returns the corresponding row name based on the given row number.
* @param {number} row - The row number.
* @returns {string} The name of the row.
*/
export const selectArray = (row: number): string => {
  let array: string;
  if (row === 1) {
    array = "firstRow";
  } else if (row === 2) {
    array = "secondRow";
  } else if (row === 3) {
    array = "thirdRow";
  } else if (row === 4) {
    array = "fourthRow";
  } else {
    array = "fifthRow";
  }
  return array;
};

/**

Dispatches an action based on the selected filter label and row id
@param {string} label - the label of the selected filter
@param {number} id - the id of the selected row
@param {function} dispatch - the dispatch function from the Redux store
@param {number[]} small - an array of small numbers to be used as a filter
@param {number[]} big - an array of big numbers to be used as a filter
@param {number[]} even - an array of even numbers to be used as a filter
@param {number[]} odd - an array of odd numbers to be used as a filter
@param {number[]} all - an array of all numbers to be used as a filter
*/
export const rowButtons = (
  label: string,
  id: number,
  dispatch?: any,
  small?: number[],
  big?: number[],
  even?: number[],
  odd?: number[],
  all?: number[]
) => {
  if (label === "Even") {
    dispatch({
      type: ACTION_TYPES.EVEN,
      payload: { rowId: selectArray(id), userSelection: even },
    });
  } else if (label === "Clear") {
    dispatch({
      type: ACTION_TYPES.CLEAR,
      payload: { rowId: selectArray(id), userSelection: [] },
    });
  } else if (label === "Odd") {
    dispatch({
      type: ACTION_TYPES.ODD,
      payload: { rowId: selectArray(id), userSelection: odd },
    });
  } else if (label === "Small") {
    dispatch({
      type: ACTION_TYPES.SMALL,
      payload: { rowId: selectArray(id), userSelection: small },
    });
  } else if (label === "Big") {
    dispatch({
      type: ACTION_TYPES.BIG,
      payload: { rowId: selectArray(id), userSelection: big },
    });
  } else {
    dispatch({
      type: ACTION_TYPES.ALL_ROWS,
      payload: { rowId: selectArray(id), userSelection: all },
    });
  }
};

/**
 * Returns an object with the same array as the value for each property.
 * 
 * @param array - The array to be used as the value for each property.
 * @returns An object with the same array as the value for each property.
 */
// export const reducerSelectionsArray = (array: any[]) => {
// let a =  {
//   firstRow: array,
//   secondRow: array,
//   thirdRow: array,
//   fourthRow: array,
//   fifthRow: array,
// };
// };

/**
 * Slice an object by keys between the start and end keys (inclusive)
 * @param obj - The object to slice
 * @param startKey - The starting key
 * @param endKey - The ending key
 * @returns The sliced object
 */
function sliceObjectByKeys<T extends Record<string, unknown>, K extends keyof T>(
  obj: any,
  startKey: any, //used to be K
  endKey: any, //used to be K
  endingPoint: any
): Record<K, T[K]> {
  const keys = Object.keys(obj) as any[];
  const startIndex = keys.indexOf(startKey);
  const endIndex = keys.indexOf(endKey);
  if (startIndex < 0 || endIndex < 0) {
    throw new Error('Start or end key not found');
  }
  const slicedObj = keys.reduce((acc, key, currIndex) => {
    if (currIndex < endingPoint) {
      acc[key] = obj[key];
    } else {
      acc[key] = [];
    }
    return acc;
  }, {} as Record<K, T[K]>);
  return slicedObj;
}


/**
 * Reduces an array into an object by assigning the same array to multiple rows in the object.
 * @param array - The array to be assigned to each row.
 * @param startingPoint - The starting point of the rows to be assigned. (Optional)
 * @param endingPoint - The ending point of the rows to be assigned. (Optional)
 * @returns The object with rows assigned with the given array.
 */
export const reducerSelectionsArray = (array: any[], startingPoint?: any, endingPoint?: any) => {
  let startKey = selectArray(startingPoint);
  let endKey = selectArray(endingPoint)

  let a = {
    firstRow: array,
    secondRow: array,
    thirdRow: array,
    fourthRow: array,
    fifthRow: array,
  };
  const selectedObject = sliceObjectByKeys(a, startKey, endKey, endingPoint)

  console.log("selectedObject", selectedObject)

  return selectedObject;
};


/**
 * Dispatch function for selecting/deselecting all rows.
 *
 * @param label - The label of the button clicked.
 * @param small - Array of numbers representing the 'small' numbers.
 * @param big - Array of numbers representing the 'big' numbers.
 * @param even - Array of numbers representing the 'even' numbers.
 * @param odd - Array of numbers representing the 'odd' numbers.
 * @param all - Array of all the numbers.
 * @param dispatch - The dispatch function from the context.
 */
export const ALL_ROWS_DISPATCH = (
  label: string,
  small: number[],
  big: number[],
  even: number[],
  odd: number[],
  all: number[],
  startingPoint?: any,
  endingPoint?: any,
  dispatch?: any,
) => {
  // Check which button was clicked and dispatch the corresponding action.
  if (label === "Clear") {
    // Dispatch the 'CLEAR_ALL_ROWS' action with an empty array.
    dispatch({
      type: ACTION_TYPES.CLEAR_ALL_ROWS,
      payload: reducerSelectionsArray([]),
    });
  } else if (label === "All") {
    console.log("bismark opele ", reducerSelectionsArray(all, startingPoint, endingPoint))
    // Dispatch the 'SELECT_ALL_ROWS' action with the 'all' array.
    dispatch({
      type: ACTION_TYPES.SELECT_ALL_ROWS,
      payload: reducerSelectionsArray(all, startingPoint, endingPoint),
    });
  } else if (label === "Small") {
    // Dispatch the 'SELECT_ALL_SMALL' action with the 'small' array.
    dispatch({
      type: ACTION_TYPES.SELECT_ALL_SMALL,
      payload: reducerSelectionsArray(small, startingPoint, endingPoint),
    });
  } else if (label === "Big") {
    // Dispatch the 'SELECT_ALL_BIG' action with the 'big' array.
    dispatch({
      type: ACTION_TYPES.SELECT_ALL_BIG,
      payload: reducerSelectionsArray(big, startingPoint, endingPoint),
    });
  } else if (label === "Even") {
    // Dispatch the 'SELECT_ALL_EVEN' action with the 'even' array.
    dispatch({
      type: ACTION_TYPES.SELECT_ALL_EVEN,
      payload: reducerSelectionsArray(even, startingPoint, endingPoint),
    });
  } else if (label === "Odd") {
    // Dispatch the 'SELECT_ALL_ODD' action with the 'odd' array.
    dispatch({
      type: ACTION_TYPES.SELECT_ALL_ODD,
      payload: reducerSelectionsArray(odd, startingPoint, endingPoint),
    });
  }
};


/**
 * An array of control buttons to select multiple rows in the game board.
 * 
 * Each control object has an `id` and a `label` property.
 * 
 * - `id`: a unique identifier for the control button.
 * - `label`: a text label for the control button.
 * 
 * The control buttons are used to select all rows, clear all rows, select even or odd rows,
 * select small or big rows, etc.
 */
export const controls = [
  { id: 1, label: "All" },    // Select all rows
  { id: 2, label: "Clear" },  // Clear all rows
  { id: 3, label: "Even" },   // Select even rows
  { id: 4, label: "Odd" },    // Select odd rows
  { id: 5, label: "Small" },  // Select small rows
  { id: 6, label: "Big" },    // Select big rows
];

/**
 * Generates all possible combinations of r elements from the given array of type T.
 * @param array - An array of elements of type T.
 * @param r - A number specifying the size of combinations to generate.
 * @returns An array of arrays of size r containing all possible combinations of the elements in the input array.
 */
export function generateCombinations<T>(array: T[], r: number): T[][] {
  const result: T[][] = [];

  // Recursive function to generate combinations
  function generateCombos(combination: T[], index: number): void {
    // Base case: when the combination has the desired size, add it to the result array and return
    if (combination.length === r) {
      result.push(combination);
      return;
    }

    // Base case: when the index is out of bounds, return
    if (index >= array.length) {
      return;
    }

    // Recursive case: create a new combination by adding the current element to the current combination
    const newCombo = [...combination];
    newCombo.push(array[index]);

    // Recursive step: generate combinations starting from the new combination and the next index, and also from the current combination and the next index
    generateCombos(newCombo, index + 1);
    generateCombos(combination, index + 1);
  }

  // Start generating combinations from an empty combination and the first index
  generateCombos([], 0);

  return result;
}

/**
 * gets the n combination r of selection
 * @param {number} n total elements
 * @param {number} r sample taken at a time
 * @returns combination of a selection
 */
export function getCombination(n: number, r: number) {
  if (!(r >= 0 && n >= r)) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

/**
 * the factorial of a number
 * @param {number} num what is the factorial of 'num'? the 'num' what is supplied to the function
 * @returns the factorial of a number
 */
export function factorial(num: number) {
  if (num == 0) return 1;
  if (num < 0) return 0;
  let result = num;
  for (let i = num - 1; i > 1; i--) result *= i;
  return result;
}

/**
 * Calculates the number of possible permutations of r items from a set of n distinct items.
 *
 * @param n The number of distinct items in the set.
 * @param r The number of items to be selected.
 * @returns The number of possible permutations of r items from a set of n distinct items.
 */
export function getPermutation(n: number, r: number): number {
  return factorial(n) / factorial(n - r);
}

//not in use anymore
export function allSelections(...rowsAndSamples: any[]): any[] | number {
  let rows: any[] = [],
    samples: any[] = [],
    perms: any[] = [],
    results: any[] = [];
  // console.log(...rowsAndSamples);
  //dividing rows and samples
  rowsAndSamples.forEach((element) => {
    Array.isArray(element) ? rows.push(element) : samples.push(element);
  });

  if (rows.length !== samples.length) return -1;

  //perming rows
  let comb, val;
  rows.forEach((element, index) => {
    comb = generateCombinations(element, samples[index]);
    for (val of comb) perms.push(val);
  });

  // getting non-repeating lists
  let startCheck = getCombination(rows[0].length, samples[0]);
  let i, j, permsSize;
  permsSize = perms.length;
  for (i = 0; i < startCheck; i++) {
    for (j = startCheck; j < permsSize; j++) {
      if (
        everyInArray(perms[j], perms[i]) ||
        everyInArray(perms[i], perms[j])
      ) {
        continue;
      }
      results.push([...perms[i], ...perms[j]]);
    }
  }
  return results.length === 0 ? perms : results;
}

/**
 * Checks if every element in the first array is included in the second array.
 *
 * @param array1 The first array to check.
 * @param array2 The second array to check.
 * @returns A boolean indicating whether every element in the first array is included in the second array.
 */
export function everyInArray(array1: Array<any>, array2: Array<any>): boolean {
  return array1.every((element: any) => {
    return array2.includes(element);
  });
}

/**
 * Formats an array of user selections into a pipe-delimited string.
 *
 * @param selections An array of user selections.
 * @returns A pipe-delimited string of the non-empty selections.
 */
export function userSelections(selections: Array<any>): string {
  return Object.values(selections)
    .filter((arr) => arr.length > 0)
    .join("|");
}

/**
 * Filters an array of selections and removes any empty arrays
 *
 * @param {Array} selections - An array of selections
 * @returns {Array} - The filtered selections array
 */
export function filterSelections(selections: Array<any>): Array<any> {
  // Log the selections array and filter out any empty arrays
  // console.log(Object.values(selections).filter((arr) => arr.length > 0));
  const filteredSelections = Object.values(selections).filter(
    (arr) => arr.length > 0
  );

  // Log the original selections array
  // console.log(selections);

  // Return the filtered selections array
  return filteredSelections;
}

export function filterEmptyValues(selections: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in selections) {
    if (selections.hasOwnProperty(key)) {
      const value = selections[key];
      if (Array.isArray(value)) {
        const filteredArray = value.filter((item) => typeof item !== "string");
        if (filteredArray.length > 0) {
          result[key] = filteredArray;
        }
      }
    }
  }

  return result;
}


/**
 * Calculates the total number of possible combinations of selections across two rows, taking into account repeated selections between the rows.
 * @param {array} row1Selections - An array containing the selections for the first row.
 * @param {number} row1Sample - An integer representing the number of selections that can be made from the first row.
 * @param {array} [row2Selections=[]] - An optional array containing the selections for the second row. Defaults to false if not provided.
 * @param {number} [row2Sample=[]] - An optional integer representing the number of selections that can be made from the second row. Defaults to false if not provided.
 * @returns {number} - The total number of possible combinations of selections across both rows.
 */
export function _combinations_totalBets(...rowsAndSamples: any[]): number {
  let rows: number[][] = [];
  let samples: number[] = [];

  // dividing rows and samples
  rowsAndSamples.forEach((element) => {
    Array.isArray(element) ? rows.push(element) : samples.push(element);
  });

  let row1Len: number = rows[0].length; // Get length of row1 Selections
  if (rows.length == 1) return getCombination(row1Len, samples[0]); // If there is only one row, return number of combinations for that row

  let row2Len: number = rows[1].length; // Get length of row2 Selections
  let row1Combinations: number = getCombination(row1Len, samples[0]); // Calculate number of combinations for first row
  let row2Combinations: number = getCombination(row2Len, samples[1]); // Calculate number of combinations for second row
  let totalCombinations: number = row1Combinations * row2Combinations; // Calculate total number of combinations
  let repeatedSelections: number = rows[1].filter((element) =>
    rows[0].includes(element)
  ).length; // Count the number of repeated selections between the two rows
  let combinationsWithoutRepeats: number = -1; // placeholder

  if (samples[0] == 1 && samples[1] == 1) {
    combinationsWithoutRepeats =
      row2Len * (row1Len - repeatedSelections) +
      repeatedSelections * (row2Len - 1); // if sample[0] and sample[1] are 1
  } else if (samples[0] != 1) {
    // If there is more than one selection in the first row
    let repeatsToRemove: number =
      getCombination(row1Len - 1, samples[0] - 1) * repeatedSelections; // Calculate number of combinations with repeated selections to remove
    combinationsWithoutRepeats = totalCombinations - repeatsToRemove; // Calculate number of combinations without repeats
  } else if (samples[1] != 1) {
    // If there is more than one selection in the second row
    let repeatsToRemove: number =
      getCombination(row2Len - 1, samples[1] - 1) * repeatedSelections; // Calculate number of combinations with repeated selections to remove
    combinationsWithoutRepeats = totalCombinations - repeatsToRemove; // Calculate number of combinations without repeats
  }
  return combinationsWithoutRepeats;
}

/**
 * Truncates a string with an ellipsis after a certain number of characters and replaces commas with spaces and pipes with commas and spaces.
 *
 * @param input - The string to be truncated and modified.
 * @param truncateAfter - The maximum length of the string before it should be truncated. Default value is 19 if not provided.
 * @returns The truncated and modified string.
 */
export function truncateEllipsis(
  input: string,
  truncateAfter: number = 20
): string {
  if (input.length > truncateAfter) {
    // Replace commas with spaces and pipes with commas followed by spaces
    const modifiedInput = input.replace(/,/g, " ").replace(/\|/g, ", ");

    // Extract a substring of length `truncateAfter` from the modified input and add an ellipsis to the end
    return `${modifiedInput.substring(0, truncateAfter)} ...`;
  } else {
    // If the input string is not longer than `truncateAfter`, return the original string
    return input.replace(/,/g, " ");
  }
}

/**
  * Calculates the yield multiplier for a bet, based on the minimum yield, bonus,
  * previous payout, and single bet amount.
  * @param {number} minimumYield - The minimum yield for the bet.
  * @param {number} bonus - The bonus for the bet.
  * @param {number} previousPaid - The previous payout for the bet.
  * @param {number} singleBetAmt - The amount of the single bet.
  * @returns {number} The yield multiplier for the bet.
*/
export function getYieldMultiplier(minimumYield: number, bonus: number, previousPaid: number, singleBetAmt: number): number {
  let dividend: number = fixArithmetic(minimumYield * previousPaid) + fixArithmetic(100 * previousPaid);
  let divisor: number = fixArithmetic(100 * bonus) - fixArithmetic(100 * singleBetAmt) - fixArithmetic(minimumYield * singleBetAmt);
  let multiplier: number = fixArithmetic(dividend / divisor);
  return Math.ceil(multiplier);
}

/**
 * Filters the key-value pairs of an object, keeping only the pairs where the values are not empty.
 * @param selections - The object to filter.
 * @returns The filtered object containing key-value pairs with non-empty values.
 */
export function filterObjectSelections(selections: { [key: string]: any }): { [key: string]: any } {
  return Object.fromEntries(
    Object.entries(selections).filter(([_, value]: [string, any]) => value.length !== 0)
  );
}

/**
 * Converts an array of objects into a formatted string.
 * @param filteredKeyArr - The array of objects to convert.
 * @returns The formatted string.
 */
function boxUserSelections(filteredKeyArr: { [key: string]: string[] }[]): string {

  const convertedArray: string[] = [];

  for (let item of filteredKeyArr) {
    for (let [key, value] of Object.entries(item)) {
      convertedArray.push(`${key}: ${value.join(", ")}`);
    }
  }

  const convertedString: string = convertedArray.join(" | ");
  return convertedString;
}

export function studBullSelections(selections: { [key: string]: number[] }, buttons: string[]): string[][] {
  let likes: string[][] = []; // Array of arrays

  Object.keys(filterObjectSelections(selections)).forEach((arr) => {
    let innerLikes: string[] = []; // Inner array for each key
    selections[arr].forEach((number) => {
      let index = number;
      if (index >= 1 && index <= 4) {
        innerLikes.push(buttons[index - 1]);
      } else if (index >= 5 && index <= 10) {
        innerLikes.push(buttons[index - 5]);
      } else if (index >= 16 && index <= 30) {
        innerLikes.push(buttons[index - 16]);
      }
    });
    likes.push(innerLikes); // Add the inner array to the likes array
  });

  return likes;
}

export function concatenateArrays(arr: string[][]): string {
  return arr.map(innerArr => innerArr.join(' ')).join(', ');
}

// export function studBullSelections(selections: { [key: string]: number[] }, buttons: string[]): (string | undefined)[] {
//   // Object.keys(selections).map((arr) => {

//   // });
//   // return selections["firstRow"].map((number) => {
//   //   let index = number;
//   //   const arr = [""]
//   //   if (index >= 1 && index <= 3) {
//   //     return buttons[index-1];
//   //   }else if (index >= 4 && index <= 10) {      console.log("index------------------------------>", buttons[index-4]);
//   //     return buttons[index-4];
//   //   }else if(index >= 16 && index <= 30){       console.log("index------------------------------>", buttons[index-16]);
//   //     return buttons[index-16];
//   //   }
//   //   return undefined;
//   // });
//   let likes : any[] = []
//    Object.keys(selections).map((arr) => {
//     console.log("arr", arr);
//     selections[arr].map((number) => {
//       let index = number;
//       if (index >= 1 && index <= 4) {
//         console.log("index------------------------------>", buttons[index - 1]);
//         return likes.push( buttons[index - 1]);
//       } else if (index >= 4 && index <= 10) {
//         console.log("index------------------------------>", buttons[index - 4]);
//         return likes.push( buttons[index - 4]);
//       } else if (index >= 16 && index <= 30) {
//         console.log("index------------------------------>", buttons[index - 16]);
//         return likes.push(buttons[index - 16]);
//       } else {
//         return likes;
//       }
//     });
//   })
//   console.log("g=============================>", likes)
//   return likes;
// }
// Object.keys(selections).map((arr) => {
//   console.log("arr", arr);
//   selections[arr].map((number) => {
//     let index = number;
//     if (index >= 1 && index <= 3) {
//       console.log("index------------------------------>", buttons[index-1]);
//       return buttons[index-1];
//     }else if (index >= 4 && index <= 10) {
//       console.log("index------------------------------>", buttons[index-4]);
//       return buttons[index-4];
//     }else if(index >= 16 && index <= 30){
//       console.log("index------------------------------>", buttons[index-16]);
//       return buttons[index-16];
//     }
//     return undefined;
//   });
export function pickGamesSelections(checkBoxes: number[]) {
  const checkBoxArr = ["1st", "2nd", "3rd", "4th", "5th"];
  let c = "";
  checkBoxes.map((item, index) => {
    c += checkBoxArr[index] + (index < checkBoxes.length - 1 ? " " : "");
  })
  return c;
}
// export const renderCheckboxes = (checkBoxArr: any[], checkedBoxes: any[], like: any, addToSelectedPlaces: (arg0: any, arg1: any) => any) => {
//   const checkboxes = [...like];
//   checkBoxArr.forEach((checkBox, i) => {
//     const isChecked = checkedBoxes.includes(i + 1);
//     checkboxes.push(
//       <label key={${i}}>
//         <input
//           type="checkBox"
//           checked={${isChecked}}
//           onChange={${(e: any) => addToSelectedPlaces(e, i)}}
//         />
//         {${checkBox}}
//       </label>
//     );
//   });
//   return checkboxes;
// };

export function filterDragonTieThreeCardsSelections(selections: { [key: string]: any }) {
  let filteredKeyArr = Object.keys(selections).map((arr) => {
    let a = selections[arr].filter((item: any) => {
      console.log("item==========================>", item)
      return typeof item === "string"
    });
    console.log("a", [arr])

    return {
      [arr]: a,
    };
  });

  return boxUserSelections(filteredKeyArr);//JSON.stringify(filteredKeyArr)
}

/**
 * Truncates decimal. chops without rounding
 * @param {number} number data to truncate
 * @param {number} decimalPlaces number of decimal places to truncate
 * @returns truncated number
 */
export function truncate(number: number, decimalPlaces: number = 3): number {
  let indexOfDecimal = number.toString().indexOf(".");
  if (indexOfDecimal == -1) return number;
  let result = number.toString().slice(0, indexOfDecimal + (decimalPlaces + 1));
  return parseFloat(result);
}

/**
  * filters non-integer characters from data provided.
  * @param {number} value the value to be filtered
  * @param {number} minValue minimum acceptable integer value
  * @param {number} maxValue maximum acceptable integer value
  * @returns only numbers from passed data.the number returned exists between a range provided by 'minValue' and 'maxValue'
  */
export function onlyNum(value: string, minValue: number = 1, maxValue: number = 99999) {
  let onlyNums = parseInt(value.replace(/\D+/g, ""));
  if (value) {
    onlyNums = onlyNums ? onlyNums : minValue;
    onlyNums = onlyNums >= maxValue ? maxValue : onlyNums;
  }
  return onlyNums;
}

/**
 * Sets the Quat value and performs related calculations.
 * @param val - The Quat value to set.
 * @param setUnit - Function to set the unit value.
 * @param setQuatar - Function to set the Quatar value.
 * @param setMultiplier - Function to set the multiplier value.
 * @param setBetAmount - Function to set the bet amount value.
 * @param toast - Object with an `error` method for displaying error messages.
 * @param totalBetsCalc - The total bets calculation value.
 * @param balance - The balance value.
 */
export const setQuat = (
  val: any,
  setUnit: (arg0: number) => void,
  setQuatar: (arg0: any) => void,
  setMultiplier: (arg0: number) => void,
  setBetAmount: (arg0: string) => void,
  toast: { error: (arg0: string) => void },
  totalBetsCalc: number,
  balance: number
) => {
  if (totalBetsCalc === 0) {
    toast.error("Kindly make selections"); // Display an error message if no selections are made
  } else {
    setQuatar(val); // Set the Quatar value
    setMultiplier(1); // Set the multiplier value to 1
    let pseudoAmount = fixArithmetic(val * balance); // Calculate the pseudo amount
    let truncatedPseudoAmount = +truncate(pseudoAmount); // Truncate the pseudo amount
    let truUnit = truncatedPseudoAmount / totalBetsCalc; // Calculate the true unit
    let finalUnit = +truncate(truUnit); // Truncate the true unit
    setUnit(finalUnit); // Set the unit value
    setBetAmount(""); // Clear the bet amount value
  }
};

/**
 * Handles setting the bet amount and performs related calculations.
 * @param e - The event object.
 * @param setUnit - Function to set the unit value.
 * @param setBetAmount - Function to set the bet amount value.
 * @param totalBetsCalc - The total bets calculation value.
 * @param toast - Object with an `error` method for displaying error messages.
 */
export const onAmountBetset = (
  e: any,
  setUnit: (arg0: number) => void,
  setBetAmount: (arg0: number) => void,
  totalBetsCalc: number,
  toast: { error: (arg0: string) => void }
) => {
  let input = e.target.value;
  if (totalBetsCalc === 0) {
    toast.error("Kindly make selections"); // Display an error message if no selections are made
  } else {
    let amount = onlyNum(input);
    setBetAmount(amount); // Set the bet amount value
    let res = +truncate(amount / totalBetsCalc); // Calculate the unit value
    setUnit(res); // Set the unit value
    setUnit(res); // (Assuming this is intended to be repeated) Set the unit value again
  }
};

/**
 * Calculates the default user's prize based on game odds and unit amount.
 * @param gameOdds - The game odds as a string or number.
 * @param unit - The unit amount.
 * @returns The calculated user's prize truncated to four decimal places.
 */
export function defaultUserPrize(gameOdds: string | number, unit: number): number {
  // Calculate the user's prize using the default rebate value (85%).
  const prize = (((85 + 15) / 100) * +gameOdds) * unit;
  let p = truncate(prize, 4)
  // setUserPrize(p)
  // Truncate the prize to four decimal places.
  return truncate(prize, 4);
}

/**
 * Calculates the user's prize based on game odds, unit amount, and user data.
 * @param gameOdds - The game odds as a string or number.
 * @param unit - The unit amount.
 * @param userData - The user's data containing the rebate value.
 * @returns The calculated user's prize truncated to four decimal places.
 */
export function calculatedUserPrize(gameOdds: string | number, unit: number, userData: { rebate: number }): number {
  // Calculate the user's prize using the rebate value from user data.
  const prize = (((85 + userData.rebate) / 100) * +gameOdds) * unit;
  let p = truncate(prize, 4)
  // setUserPrize(p)
  // Truncate the prize to four decimal places.
  return truncate(prize, 4);
}

//  function _combinations_totalBets(...rowsAndSamples: any[]): number {
//     let rows:any = [], samples:any = [];
//     //dividing rows and samples
//     rowsAndSamples.forEach((element:number) => {
//       Array.isArray(element) ? rows.push(element) : samples.push(element);
//     });
// // console.log(rows, samples)
//     let row1Len = rows[0]?.length; // Get length of row1 Selections
//     if (rows.length == 1) return getCombination(row1Len, samples[0]); // If there is only one row, return number of combinations for that row
//     let row2Len = rows[1]?.length; // Get length of row2 Selections
//     let row1Combinations = getCombination(row1Len, samples[0]); // Calculate number of combinations for first row
//     let row2Combinations = getCombination(row2Len, samples[1]); // Calculate number of combinations for second row
//     let totalCombinations = row1Combinations * row2Combinations; // Calculate total number of combinations
//     let repeatedSelections = rows[1]?.filter((element:any) => rows[0].includes(element)).length; // Count the number of repeated selections between the two rows
//     let combinationsWithoutRepeats = -1; // Placeholder for variable to be calculated
//     if (samples[0] != 1) { // If there is more than one selection in the first row
//       let repeatsToRemove = getCombination(row1Len - 1, samples[0] - 1) * repeatedSelections; // Calculate number of combinations with repeated selections to remove
//       combinationsWithoutRepeats = totalCombinations - repeatsToRemove; // Calculate number of combinations without repeats
//     }
//     if (samples[1] != 1) { // If there is more than one selection in the second row
//       let repeatsToRemove = getCombination(row2Len - 1, samples[1] - 1) * repeatedSelections; // Calculate number of combinations with repeated selections to remove
//       combinationsWithoutRepeats = totalCombinations - repeatsToRemove; // Calculate number of combinations without repeats
//     }
//     return combinationsWithoutRepeats;
//   }
