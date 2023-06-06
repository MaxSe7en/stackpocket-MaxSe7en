// App.tsx
import React, {
  useEffect,
  useReducer,
  useState,
  useMemo,
} from "react";
import GamePlayComponent from "./GamePlayComponent";
import { trackReducer } from "@/games/5d/useReducer";
import {
  ACTION_TYPES,
  INITIAL_TRACK_STATE,
  TRACK_ACTION_TYPES,
} from "@/games/5d/stateActions";
import { INITIAL_CART_STATE } from "@/games/5d/stateActions";
import { cartReducer } from "@/games/5d/useReducer";
import styles from "../../styles/GamePlayWrapper.module.css";

// import { straightCombo, straightJoint } from "@/functions/betsCalculation";
import Cart from "@/components/uiComponents/Cart";
import {
  filterDragonTieThreeCardsSelections,
  filterObjectSelections,
  filterSelections,
  fixArithmetic,
  getDate,
  getTime,
  pickGamesSelections,
  reducerSelectionsArray,
  studBullSelections,
  userSelections,
} from "@/functions/msc";
import { GameData } from "@/interfaces/reducer";
import { cartBetNow } from "@/services/betnow";
import Track from "./Track";
// import Cart from "./Cart";
import {
  createTrackJson,
  createTrackYield,
  sumBetAmtAndBets,
} from "@/functions/cartTruck";
import { mainStateProvider } from "../../StateContex/index";
import toast, { Toaster } from "react-hot-toast";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { getBalance } from "@/services/msc_data";
import Multiplier from "./Multiplier";
import GamePlayComponent2 from "./GamePlayComponent2";
import { generateNumbers } from "@/functions/numberGeneratorModule";
import Manual from "../Manual";
const style = {
  position: "absolute" as "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  height: "fit-content",
  overflow: "unset",
  // p: 4,
};

// Define an interface for the "AppProps" object passed to the component
type AppProps = {
  rows: number; // The number of rows to render
  start: number; // The starting position for the game
  end: number; // The ending position for the game
  columnSelection: boolean; // A boolean value indicating whether or not column selection is enabled
  rowSelection: boolean; // A boolean value indicating whether or not row selection is enabled
  selections?: any; // An optional value that represents the current selections made by the user
  dispatch?: any; // An optional function that is used to update the "selections" state
  showRowName?: boolean; // An optional boolean value indicating whether or not the row name should be displayed
  startingPoint: number; // The starting point for the rows
  endingPoint: number; // The ending point for the rows
  gameFunction: Function;
  betId: string;
  gameId: number;
  showCheckbox: boolean;
};

// An array of numbers representing the rows to render
const rowsArr = [
  { number: 1, name: "1st" },
  { number: 2, name: "2nd" },
  { number: 3, name: "3rd" },
  { number: 4, name: "4th" },
  { number: 5, name: "5th" },
];

/**
 * This is a functional component called "GamePlayWrapper" that receives an object of props named "AppProps".
 * It renders a div that contains multiple instances of another component called "GamePlayComponent", based on the number of rows passed as a prop.
 */
const GamePlayWrapper: React.FC<AppProps> = ({
  rows, // The number of rows to render
  start, // The starting position for the game
  end, // The ending position for the game
  columnSelection, // An array of column indices that should be selected
  rowSelection, // An array of row indices that should be selected
  showRowName, // A boolean value indicating whether or not the row name should be displayed
  startingPoint, // The starting point for the rows
  endingPoint, // The ending point for the rows
  gameFunction,
  dispatch,
  selections,
  betId,
  gameId,
  showCheckbox,
}) => {
  /**
   * This initializes state management for the component.
   * The "useReducer" hook is used to manage state, and the "INITIAL_STATE" object provides the initial state values.
   * The "selections" state represents the current selections made by the user.
   */
  const [multiplier, setMultiplier] = useState(1);
  const [quatar, setQuatar] = useState<object[]>([]);
  const [betResponse, SetResponse] = useState<any>(null);
  const [cartState, cartDispatch] = useReducer(cartReducer, INITIAL_CART_STATE);
  const [trackState, trackDispatch] = useReducer(
    trackReducer,
    INITIAL_TRACK_STATE
  );

  const { rowSelector } = generateNumbers(start, end, dispatch);

  const Buttons = [
    "Four of a kind",
    "Gourd",
    "Streak",
    "Three of a Kind",
    "2 pairs",
    "1 pair",
    "High Card",
  ];
  const Buttons2 = ["Bull Big", "Bull Small", "Bull Odd", "Bull Even", "No Bull", "Bull 1", "Bull 2", "Bull 3", "Bull 4", "Bull 5", "Bull 6", "Bull 7", "Bull 8", "Bull 9", "Bull Bull"]

  const Buttons1 = [
    "Bull Big",
    "Bull Small",
    "Bull Odd",
    "Bull Even",
    "No Bull",
    "Bull 1",
    "Bull 2",
    "Bull 3",
    "Bull 4",
    "Bull 5",
    "Bull 6",
    "Bull 7",
    "Bull 8",
    "Bull 9",
    "Bull Bull",
  ];
  const {
    balance,
    setBallance,
    game_type_name,
    open,
    setOpen,
    unit,
    lottery_type_id,
    gameGroup,
    userPrize,
    drawData,
    gameType_id,
    checkedBoxes,
  } = mainStateProvider();

  // const handleOpen = () => setOpen(true);
  const handleClose = () => {
    dispatch({
      type: ACTION_TYPES.CLEAR_ALL_ROWS,
      payload: reducerSelectionsArray([]),
    });
    setOpen(false);
  };
  const defaultTrackDraws = 10;
  const firstMultiplier = 1;
  const multiplyAfterEvery = 1;
  const multiplyBy = 1;
  const firstYieldMultiplier = 1;
  const minimumYield = 50;
  const trackYieldDraw = 10;

  // let totalBetsCalc = gameFunction(selections, startingPoint, rows);
  let totalBetsCalc = gameFunction();
  let totalBetAmt = fixArithmetic(totalBetsCalc * unit * multiplier);

  let bet: GameData = {
    uid: 1, //PASS USER ID HERE
    allSelections: filterSelections(selections),
    userSelections: userSelections(selections),
    multiplier: multiplier,
    totalBets: totalBetsCalc,
    gameId: gameId, //PASS GAME ID HERE
    totalBetAmt: fixArithmetic(totalBetAmt),
    unitStaked: unit,
    betId: betId,
    lottery_id: +lottery_type_id,
    gameType: game_type_name,
    bet_time: getTime("" + new Date()),
    bet_date: getDate("" + new Date()),
  };

  const modifiedBet = useMemo(() => {
    switch (gameGroup) {
      case "Fixed Place":
        return { ...bet, allSelections: Object.values(selections) };
      case "Dragon/Tiger/Tie":
      case "Three cards":
        let u = filterObjectSelections(selections);
        return {
          ...bet,
          allSelections: [u],
          userSelections: filterDragonTieThreeCardsSelections(u),
        };
      case "B/S/O/E":
        return { ...bet, allSelections: "randy", userSelections: "[1,2,3]" };
      case "Stud":
        // case "Bull Bull":
        return { ...bet, userSelections: studBullSelections(selections, Buttons).join(", ") };
      case "Bull Bull":
        return { ...bet, userSelections: studBullSelections(selections, Buttons2).join(", ") };
      case "Pick 2":
      case "Pick 3":
      case "Pick 4":
        return {
          ...bet,
          allSelections: [checkedBoxes, filterSelections(selections)[0]],
          userSelections: `(${pickGamesSelections(checkedBoxes)}), ${filterSelections(selections)}`,
        };
      default:
        return bet;
    }
  }, [gameGroup, selections, betId, multiplier, unit]);

  const [trackType, setTrackType] = useState("");
  const [trackYieldData, setTrackYieldData] = useState(
    createTrackYield(
      drawData.drawDateTime,
      drawData.nextBetId,
      trackYieldDraw,
      bet.totalBets,
      firstYieldMultiplier,
      bet.totalBetAmt,
      userPrize, //should be taken from api
      drawData.nextBetId,
      minimumYield
    )
  );

  const [trackData, setTrackData] = useState(
    createTrackJson(
      drawData.drawDateTime,
      drawData.nextBetId,
      defaultTrackDraws,
      firstMultiplier,
      multiplyAfterEvery,
      multiplyBy,
      bet.totalBetAmt,
      bet.totalBets,
      drawData.drawDateTime
    )
  );

  const trackBet = (items: GameData) => {
    setTrackType("trackBet");
    trackDispatch({
      type: TRACK_ACTION_TYPES.TRACK_BET,
      payload: Array(items),
    });
    setTrackData(
      createTrackJson(
        drawData.drawDateTime,
        drawData.nextBetId,
        defaultTrackDraws,
        firstMultiplier,
        multiplyAfterEvery,
        multiplyBy,
        bet.totalBetAmt,
        bet.totalBets,
        drawData.nextBetId
      )
    );
    setTrackYieldData(
      createTrackYield(
        drawData.drawDateTime,
        drawData.nextBetId,
        trackYieldDraw,
        bet.totalBets,
        firstYieldMultiplier,
        bet.totalBetAmt,
        userPrize, //should be taken from api
        drawData.nextBetId,
        minimumYield
      )
    );
    setOpen(true);
  };

  const trackCart = (cartState: { items: any }) => {
    setTrackType("trackCart");
    const obj = cartState.items;
    trackDispatch({
      type: TRACK_ACTION_TYPES.TRACK_BET,
      payload: Object.keys(obj).map((key) => obj[key]),
    });
    setTrackData(
      createTrackJson(
        drawData.drawDateTime,
        drawData.nextBetId,
        defaultTrackDraws,
        firstMultiplier,
        multiplyAfterEvery,
        multiplyBy,
        sumBetAmtAndBets(cartState["items"])[0],
        sumBetAmtAndBets(cartState["items"])[1],
        drawData.nextBetId
      )
    );
    setTrackYieldData(
      createTrackYield(
        drawData.drawDateTime,
        drawData.nextBetId,
        trackYieldDraw,
        sumBetAmtAndBets(cartState["items"])[1],
        firstYieldMultiplier,
        sumBetAmtAndBets(cartState["items"])[0],
        userPrize, //should be taken from api
        drawData.nextBetId,
        minimumYield
      )
    );
    setOpen(true);
  };

  useEffect(() => {
    if (betResponse) {
      console.log("kkk", betResponse);

      if (betResponse.type === "error") {
        toast.error(betResponse.message as string);
      } else {
        toast.success(betResponse.message);
      }

      getBalance(setBallance);
    }
  }, [betResponse]);

  useEffect(() => {
    console.log("cartdata", Object.values(cartState.items));
  }, [cartState]);

  useEffect(() => {
    console.log("cartState", cartState);
    console.log("sumBetAmtAndBets", sumBetAmtAndBets(cartState["items"]));
  }, [cartState]);

  useEffect(() => {
    console.log("selectionsssss--> ", selections);
  }, [selections]);

  const manual: Readonly<number>[] = [
    2, 11, 18, 25, 31, 33, 34, 38, 44, 46, 47, 51, 57, 59, 60, 64, 68, 92,
    96, 126, 129, 133, 140,
  ];

  return (
    <div className={styles.board}>
      {/* <button onClick={() => Alert.alert("test","sdf")}>Testing</button> */}
      <Toaster position="bottom-center" reverseOrder={false} />
      {/* This maps over an array of numbers up to the number of rows and renders a "GamePlayComponent" for each one */}
      {manual.includes(gameType_id) ? (
        <Manual
          selections={selections}
          rows={rows}
          dispatch={dispatch}
          game_id={gameType_id}
          showCheckbox={showCheckbox}
        />
      ) : (
        rowsArr
          .slice(startingPoint - 1, endingPoint)
          .map(({ number, name }, index) => (
            <GamePlayComponent
              start={start}
              end={end}
              key={number}
              rowId={number}
              rowName={name}
              rows={rows}
              index={index}
              columnSelection={columnSelection}
              rowSelection={rowSelection}
              selections={selections}
              dispatch={dispatch}
              showRowName={showRowName}
              startingPoint={startingPoint}
              endingPoint={endingPoint}
              showCheckbox={showCheckbox}
            />
          ))
      )}

      <GamePlayComponent2
        game_id={gameType_id}
        Buttons={Buttons}
        Buttons1={Buttons1}
      />
      {/* <GamePlayComponent2 game_id={gameType_id} Buttons={Buttons} Buttons1={Buttons1} /> */}
      <br />
      <br />
      <div className={styles.cartBox}>
        <Multiplier
          trackBet={trackBet}
          totalBetsCalc={totalBetsCalc}
          setQuatar={setQuatar}
          multiplier={multiplier}
          setMultiplier={setMultiplier}
          SetResponse={SetResponse}
          bet={modifiedBet}
          dispatch={dispatch}
          totalBetAmt={totalBetAmt}
          quatar={quatar}
        />
        <div className={styles.addbutt}>
          <Cart bet={bet} cartDispatch={cartDispatch} cartState={cartState} />
          {Object.values(cartState.items).length > 0 ? (
            <div className={styles.plate}>
              <center>
                <div className={styles.ballatxt}>Balance</div>
                <div className={styles.balla}>{balance} yuan</div>
                <button
                  className={styles.betnow}
                  disabled={
                    balance < sumBetAmtAndBets(cartState.items)[0]
                      ? true
                      : false
                  }
                  style={{
                    background:
                      balance < sumBetAmtAndBets(cartState.items)[0]
                        ? "#cccccc"
                        : "",
                    color:
                      balance < sumBetAmtAndBets(cartState.items)[0]
                        ? "grey"
                        : "",
                  }}
                  onClick={() =>
                    cartBetNow(
                      cartState,
                      betId,
                      SetResponse,
                      cartDispatch,
                      setBallance
                    )
                  }
                >
                  bet now
                </button>
                <button
                  className={styles.track}
                  onClick={() => trackCart(cartState)}
                >
                  Track
                </button>
              </center>
            </div>
          ) : null}
          {/* <Track bet={bet} trackState={trackState} trackDispatch={trackDispatch}/> */}
        </div>
        {/*        
        <Track
          cartState={cartState}
          bet={bet}
          trackDispatch={trackDispatch}
          trackState={trackState}
          
        /> */}
      </div>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Track
            onClose={handleClose}
            bet={bet}
            trackState={trackState}
            cartState={cartState}
            trackDispatch={trackDispatch}
            trackData={trackData}
            trackYieldData={trackYieldData}
            setTrackYieldData={setTrackYieldData}
            setTrackData={setTrackData}
            trackCart={trackCart}
            trackBet={trackBet}
            trackType={trackType}
            SetResponse={SetResponse}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default GamePlayWrapper; // Export the component as the default export for use in other files

// const trackYieldData = useCallback(
//   () =>
//     createTrackYield(
//       drawData.drawDateTime,
//       drawData.nextBetId,
//       trackYieldDraw,
//       bet.totalBets,
//       firstYieldMultiplier,
//       bet.totalBetAmt,
//       userPrize, //should be taken from api
//       // drawData.drawDateTime,
//       minimumYield
//     ),
//   []
// );

// <div>{game_type_name}</div>
{
  /* {game_type_name === "Dragon/Tiger/Tie" && <DragonTigerTie />}
          {game_type_name === "B/S/O/E of First 2" && <BOSE />}
          {game_type_name === "Stud" && <Stud />}
          {game_type_name === "All 3 Three cards" && <ThreeCards />}
          {game_type_name === "Bull Bull" && <BullBull />}
          {game_type_name === "All 5 Straight (Manual)" && (
            <Manual dispatch={dispatch} rowSelector={rowSelector} selections={selections} rows={rows}/>
          )} */
}
