import { CART_ACTION_TYPES, TRACK_ACTION_TYPES } from "@/games/5d/stateActions";

export type State = {
  // firstRow: number[];
  // secondRow: number[];
  // thirdRow: number[];
  // fourthRow: number[];
  // fifthRow: number[];
  [key: string]: any;
};

export type Action = {
  type: string;
  payload: {
    rowId: string;
    userSelection: any;
    game_id: number;
  };
};

//make an action for this and state 
// {

//   "game_name": {
//     "1st": {
//       BS: [{ big: 12 }, { small: 13 }],
//       OE: [{ odd: 14 }, { even: 14 }],
//       PC: ["prime", "composite"],
//       NM: [{ 1: 12 }, 2, 3, 4, 5, 6, 7, 8, 9],
//     },
//   }
// }


export type ManyTablesState = {
  // firstRow: number[];
  // secondRow: number[];
  // thirdRow: number[];
  // fourthRow: number[];
  // fifthRow: number[];
  [key: string]: any;
};

export type ManyTablesAction = {
  type: string;
  payload: {
    rowId: string;
    userSelection: any;
    game_id: number;
    game_name: string;
  };
};

export type TwoSideState ={
  [key: string]: any;
}

export type LongDragonState ={
  [key: string]: any;
}
export interface TwoSidesAction {
  type: string;
  payload: {
    rowId: string;
    userSelection: any;
    game_id: number;
    game_name: string;
    amount: any;
    position: any;
    label_id: number;
  }
}

export interface LongDragonAction {
  type: string;
  payload: {
    userSelection: any;
    game_id: number;
    game_name: string;
    amount: any;
    lottery_id: number;
  }
}
// export type Two_Sides_Action = {
//   type: string;
//   payload: {
//     rowId: string;
//     userSelection: any;
//     game_id: number;
//   }
// }
// export interface CartItem {
//   id: number;
//   name: string;
//   quantity: number;
// }
export interface CartState {
  items: { [id: number]: GameData };
}

export type TrackState = any;
// items: { [id: number ]: GameData };

export interface GameData {
  uid: any | number;
  gameId: number;
  unitStaked: number;
  totalBetAmt: number;
  multiplier: number;
  totalBets: number;
  betId: string;
  allSelections: any; // Replace 'any' with a more specific type if possible
  userSelections: string;
  game_label: string;
  lottery_id: number;
  bet_time: string;
  bet_date: string;
}

export type CartAction =
  | { type: typeof CART_ACTION_TYPES.PLACE_BET; payload: GameData }
  | { type: typeof CART_ACTION_TYPES.ADD_TO_CART; payload: GameData }
  | {
    type: typeof CART_ACTION_TYPES.UPDATE_CART_ITEM;
    payload: {
      uid: number;
      multiplier: number;
      totalBetAmt: number;
      operation: string;
    };
  }
  | { type: typeof CART_ACTION_TYPES.REMOVE_FROM_CART; payload: number }
  | { type: typeof CART_ACTION_TYPES.UPDATE_CART_ITEM_UNIT; payload: { uid: number; unitStaked: number } }
  | { type: typeof CART_ACTION_TYPES.CLEAR_CART };

export type TrackAction = {
  type: typeof TRACK_ACTION_TYPES.TRACK_BET;
  payload: GameData[];
};
