import {
  CartState,
  CartAction,
  TrackAction,
  TrackState,
} from "./../../interfaces/reducer";
import { Action, State } from "@/interfaces/reducer";
import {
  ACTION_TYPES,
  CART_ACTION_TYPES,
  TRACK_ACTION_TYPES,
} from "./stateActions";
import { fixArithmetic, selectArray } from "@/functions/msc";

// Define the Reducer function with state and action arguments
export const Reducer = (state: State, action: Action) => {
  // Use a switch statement to handle different action types
  switch (action.type) {
    // For these action types, set the user selection value for the corresponding row in the state object
    case ACTION_TYPES.BIG:
    case ACTION_TYPES.SMALL:
    case ACTION_TYPES.EVEN:
    case ACTION_TYPES.ODD:
    case ACTION_TYPES.ALL_ROWS:
    case ACTION_TYPES.CLEAR:
      return {
        ...state,
        [action.payload.rowId]: action.payload.userSelection,
      };

    // For this action type, check if the user selection exists in all columns for each row.
    // If not, add the user selection to each row's array in the state object.
    case ACTION_TYPES.ALL_COLUMNS:
      let shouldAdd = true;
      if (
        state.firstRow.includes(action.payload.userSelection) &&
        state.secondRow.includes(action.payload.userSelection) &&
        state.thirdRow.includes(action.payload.userSelection) &&
        state.fourthRow.includes(action.payload.userSelection) &&
        state.fifthRow.includes(action.payload.userSelection)
      ) {
        shouldAdd = false;
      }
      if (shouldAdd) {
        const newState = {
          ...state,
          firstRow: [
            ...new Set([...state.firstRow, action.payload.userSelection]),
          ],
          secondRow: [
            ...new Set([...state.secondRow, action.payload.userSelection]),
          ],
          thirdRow: [
            ...new Set([...state.thirdRow, action.payload.userSelection]),
          ],
          fourthRow: [
            ...new Set([...state.fourthRow, action.payload.userSelection]),
          ],
          fifthRow: [
            ...new Set([...state.fifthRow, action.payload.userSelection]),
          ],
        };
        return newState;
      }
      return state;

    // For this action type, remove the user selection from all rows' arrays in the state object.
    case ACTION_TYPES.ALL_CLEAR:
      const rowIds = [
        "firstRow",
        "secondRow",
        "thirdRow",
        "fourthRow",
        "fifthRow",
      ];

      // Create a new state object by filtering out the user selection from each row's array
      const newState = <any>{};
      for (const rowId of rowIds) {
        newState[rowId] = [
          ...state[rowId].filter(
            (number: number) => number !== action.payload.userSelection
          ),
        ];
      }

      return {
        ...state,
        ...newState,
      };

    // For this action type, toggle the user selection in the corresponding row's array in the state object.
    case ACTION_TYPES.ON_SELECT:
      const fixedDigitId = [35, 48, 61, 70, 98, 131];

      const currentItems = state[action.payload.rowId];
      const newItem = action.payload.userSelection[0];
      const gameid = action.payload.game_id;
      console.log("gameid", gameid)
      if (fixedDigitId.includes(gameid)) {
        // Check if the newItem already exists in the currentItems array
        const itemExists = currentItems.includes(newItem);

        // Create a new array by either filtering out the existing item or adding the new item
        const newItems = itemExists
          ? currentItems.filter((item: number) => item !== newItem)
          : [newItem];
        console.log("newItems", newItems);
        return {
          [action.payload.rowId]: newItems,
        };
      } else {
        // Check if the newItem already exists in the currentItems array
        const itemExists = currentItems.includes(newItem);

        // Create a new array by either filtering out the existing item or adding the new item
        const newItems = itemExists
          ? currentItems.filter((item: number) => item !== newItem)
          : [...currentItems, newItem];

        return {
          ...state,
          [action.payload.rowId]: [...new Set(newItems)],
        };
      }

    case ACTION_TYPES.CLEAR_ALL_ROWS:
    case ACTION_TYPES.SELECT_ALL_ROWS:
    case ACTION_TYPES.SELECT_ALL_EVEN:
    case ACTION_TYPES.SELECT_ALL_ODD:
    case ACTION_TYPES.SELECT_ALL_BIG:
    case ACTION_TYPES.SELECT_ALL_SMALL:
      return action.payload;
    case ACTION_TYPES.MANUAL:

      const newState1 = <any>{};
      let data = action.payload.userSelection;
      data?.forEach((row: [], index: number) => {
        let rowId = selectArray(index + 1);
        newState1[rowId] = row;
      });

      return {
        ...state,
        ...newState1,
      };

    case ACTION_TYPES.DRAGON_TIGER:
      console.log("dragon tiger");
      const { rowId, userSelection, game_id } = action.payload;

      // Create a new state object with the existing state
      const newStates = { ...state };

      // Check if the key '2v4' already exists in the state
      if (newStates.hasOwnProperty(rowId)) {
        const existingArray = newStates[rowId];
        const updatedArray = existingArray.filter(
          (item: any) => item !== userSelection && item !== game_id
        );
        // If the item is already present in the array, remove it
        // by filtering out the id and name from the existing array
        if (existingArray.length === updatedArray.length) {
          newStates[rowId] = [...existingArray, userSelection, game_id];
        } else {
          newStates[rowId] = updatedArray;
        }
      } else {
        // If the key doesn't exist, create a new array with the id and name
        newStates[rowId] = [userSelection, game_id];
      }

      return newStates;

    // If the action type does not match any cases above, return the current state object
    default:
      return state;
  }
};
export const cartReducer = (
  state: CartState,
  action: CartAction
): CartState => {
  switch (action.type) {
    case CART_ACTION_TYPES.PLACE_BET:
      return {
        ...state,
        items: { [action.payload.uid]: action.payload },
      };
    case CART_ACTION_TYPES.ADD_TO_CART:
      return {
        ...state,
        items: { ...state.items, [action.payload.uid]: action.payload },
      };
    case CART_ACTION_TYPES.UPDATE_CART_ITEM:
      const updatedItem = {
        ...state.items[action.payload.uid],
        multiplier: action.payload.multiplier,
        totalBetAmt:
          action.payload.operation === "sub"
            ? action.payload.totalBetAmt -
            action.payload.totalBetAmt / (action.payload.multiplier + 1)
            : action.payload.totalBetAmt +
            action.payload.totalBetAmt / (action.payload.multiplier - 1),
      };
      return {
        ...state,
        items: { ...state.items, [action.payload.uid]: updatedItem },
      };
    case CART_ACTION_TYPES.UPDATE_CART_ITEM_UNIT:
      const item = state.items[action.payload.uid];
      const initialTotalBetAmt = fixArithmetic(
        item.totalBetAmt / item.unitStaked
      ); // calculate initial total bet amount per unit stake
      const updateCartItem = {
        ...item,
        unitStaked: action.payload.unitStaked,
        totalBetAmt: initialTotalBetAmt * action.payload.unitStaked, // calculate new total bet amount based on new unit stake and initial total bet amount per unit stake
      };
      return {
        ...state,
        items: { ...state.items, [action.payload.uid]: updateCartItem },
      };
    case CART_ACTION_TYPES.REMOVE_FROM_CART:
      const { [action.payload]: removedItem, ...newItems } = state.items;
      return {
        ...state,
        items: newItems,
      };
    case CART_ACTION_TYPES.CLEAR_CART:
      return {
        ...state,
        items: {},
      };
    default:
      return state;
  }
};

export const trackReducer = (
  state: TrackState,
  action: TrackAction
): TrackState => {
  switch (action.type) {
    case TRACK_ACTION_TYPES.TRACK_BET:
      console.log("action payload=========================>", action.payload);
      return Array(action.payload)[0];
    default:
      return state;
  }
};
