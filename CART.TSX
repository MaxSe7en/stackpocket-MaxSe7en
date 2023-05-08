import { CartState, GameData } from "@/interfaces/reducer";
import { ChangeEvent, memo, useEffect } from "react";
import {
  filterSelections,
  gameData,
  userSelections,
} from "../../functions/msc";
import { sumBetAmtAndBets } from "@/functions/cartTruck";
import { CART_ACTION_TYPES } from "@/games/5d/stateActions";

interface cartC {
  // game: any;
  // selections: number[];
  // multiplier: number;
  // totalBets: number;
  // gameId: number;
  // totalBetAmt: number;
  // unitStaked: number;
  bet: GameData;
  cartState: CartState;
  cartDispatch: any;
}

let itemIdCounter = 0; // add this outside the Cart component
const options = [
  { label: "2", value: "2" },
  { label: "1", value: "1" },
  { label: "0.2", value: "0.2" },
  { label: "0.02", value: "0.02" },
  { label: "0.01", value: "0.01" },
  { label: "0.002", value: "0.002" },
  { label: "0.001", value: "0.001" },
];
const Cart = ({
  // selections,
  // multiplier,
  // totalBets,
  // gameId,
  // totalBetAmt,
  // unitStaked,
  bet,
  cartState,
  cartDispatch,
}: cartC) => {
  const addToCart = (item: GameData) => {
    console.log(item);
    cartDispatch({
      type: CART_ACTION_TYPES.ADD_TO_CART,
      payload: item,
    });
  };
  const updateCartItem = (uid: number, multiplier: number, totalBetAmt: number, operation: string) => {
    console.log("cartState.items[uid].totalBetAmt", cartState.items[uid].totalBetAmt)

    // if (operation === "sub" && multiplier < 1) {
    //   multiplier = 1;
    // }

    cartDispatch({
      type: CART_ACTION_TYPES.UPDATE_CART_ITEM,
      payload: { uid, multiplier, totalBetAmt: totalBetAmt, operation },
    });
  };
  const updateCartUnitItem = (uid: number, unitStaked: number, totalBetAmt: number) => {
    console.log("cartState.items[uid].totalBetAmt", cartState.items[uid].totalBetAmt)

    cartDispatch({
      type: CART_ACTION_TYPES.UPDATE_CART_ITEM_UNIT,
      payload: { uid, unitStaked, totalBetAmt: totalBetAmt },
    });
  };

  const removeFromCart = (id: number) => {
    cartDispatch({ type: CART_ACTION_TYPES.REMOVE_FROM_CART, payload: id });
  };

  const clearCart = () => {
    cartDispatch({ type: CART_ACTION_TYPES.CLEAR_CART });
  };

  const totalItems = Object.values(cartState.items).reduce(
    (acc, item) => acc + item.multiplier,
    0
  );

  const updateUnit = (e: ChangeEvent<HTMLSelectElement>, item: GameData) => {
    console.log(e.target.value)
    updateCartUnitItem(item.uid, +e.target.value, item.totalBetAmt)
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      <p>Total Items: {totalItems}</p>
      <ul>
        {Object.values(cartState.items).map((item) => (
          <li key={item.uid}>
            <span>uid {item.uid + " "}</span>
            <span>{item.multiplier}</span>
            <span>
              <button
                onClick={() => updateCartItem(item.uid, (item.multiplier - 1), item.totalBetAmt, "sub")}
              >
                - {"total" + item.totalBetAmt}
              </button>
              {item.multiplier}
              <button
                onClick={() => {

                  updateCartItem(item.uid, (item.multiplier + 1), item.totalBetAmt, "add")
                }}
              >
                +
              </button>
            </span>
            {/* //make a small select button to change unitStake [2, 1, 0.2, 0.02, 0.01, 0.002, 0.001];*/}
            <span>
              <span>{item.unitStaked}</span>
              <select name="change_cart_unit" id="change_cart_unit" value={item.unitStaked} onChange={(e) => updateUnit(e, item)} >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </span>
            <button onClick={() => removeFromCart(item.uid)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addToCart({ ...bet, uid: ++itemIdCounter })}>
        Add Cart
      </button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

export default memo(Cart);
