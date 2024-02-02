import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import styles from "@page.module.css"//"./page.module.css";
//
import styles from "./page.module.css";
import {
  calculatedUserPrize,
  handleChange,
  handleInputValues,
  isEmpty,
  removeWhiteSpaces,
} from "@/functions/msc";
import axios from "axios";
import { roadbet_info_url, road_draws_url } from "@/utils/Endpoints";
import { MainStateProvider } from "@/StateContex";
import {
  AnalysisResults,
  BigBoyType,
  CockroachType,
  ColWidthType,
  NextColorType,
  NumbersCategory,
  PercentageType,
  PlaceCheckBox,
  PlaceCheckBoxState,
  SmallRoadType,
  TreeType,
} from "@/interfaces/component";
import DerivedRoads from "./HelperComponents/DerivedRoads";
import DerivedRoadColorsSection from "./HelperComponents/DerivedRoadColorsSection";
import MainRoad from "./HelperComponents/MainRoad";
import { fetcher } from "@/services/global/api";
import useRoadBetControlBoard from "@/components/BetStatistics/RoadBet/ControlBoardLayout";
import {
  ROAD_BET_ACTION_TYPES,
  TWO_SIDES_ACTION_TYPES,
} from "@/games/5d/stateActions";
import ControlBoard from "@/components/BetStatistics/RoadBet/ControlBoard";

import { LuLassoSelect } from "react-icons/lu";

const listData = [
  {
    place: ["Sum", "1st", "2nd", "3rd", "4th", "5th"],
    form: ["Big/Small", "Odd/Even", "Dragon/Tiger", "P/C"],
  },
];

const FRT = [
  {
    name: "Big",
    odds: 1.45,
  },
  {
    name: "Small",
    odds: 1.25,
  },
];
//name+group_type[1]
const SND = [
  {
    gn_id: 1,
    name: "1st",
    group_type: "Big/Small",
    odds: "2.000",
  },
  {
    gn_id: 2,
    name: "2nd",
    group_type: "Big/Small",
    odds: "2.000",
  },
  {
    gn_id: 3,
    name: "3rd",
    group_type: "Big/Small",
    odds: "2.000",
  },
  {
    gn_id: 4,
    name: "4th",
    group_type: "Big/Small",
    odds: "2.000",
  },
  {
    gn_id: 5,
    name: "5th",
    group_type: "Big/Small",
    odds: "2.000",
  },
  {
    gn_id: 6,
    name: "1st",
    group_type: "Odd/Even",
    odds: "2.000",
  },
  {
    gn_id: 7,
    name: "2nd",
    group_type: "Odd/Even",
    odds: "2.000",
  },
  {
    gn_id: 8,
    name: "3rd",
    group_type: "Odd/Even",
    odds: "2.000",
  },
  {
    gn_id: 9,
    name: "4th",
    group_type: "Odd/Even",
    odds: "2.000",
  },
  {
    gn_id: 10,
    name: "5th",
    group_type: "Odd/Even",
    odds: "2.000",
  },
  {
    gn_id: 14,
    name: "Sum",
    group_type: "Dragon/Tiger",
    odds: "2.300",
    sub_game: [
      {
        odds: "2.300",
        label: "Dragon",
      },
      {
        odds: "2.300",
        label: "Tiger",
      },
      {
        odds: "10.000",
        label: "Tie",
      },
    ],
  },
  {
    gn_id: 21,
    name: "Sum",
    group_type: "Big/Small",
    odds: "4.411",
  },
  {
    gn_id: 22,
    name: "Sum",
    group_type: "Odd/Even",
    odds: "4.411",
  },
  {
    gn_id: 23,
    name: "1st",
    group_type: "P/C",
    odds: "2.000",
  },
  {
    gn_id: 24,
    name: "2nd",
    group_type: "P/C",
    odds: "2.000",
  },
  {
    gn_id: 25,
    name: "3rd",
    group_type: "P/C",
    odds: "2.000",
  },
  {
    gn_id: 26,
    name: "4th",
    group_type: "P/C",
    odds: "2.000",
  },
  {
    gn_id: 27,
    name: "5th",
    group_type: "P/C",
    odds: "2.000",
  },
];

const selectAllObjects = {
  Sum: {
    "Big/Small": "Big/Small",
    "Odd/Even": "Odd/Even",
    "Dragon/Tiger": "Dragon/Tiger",
  },
  "1st": { "Big/Small": "Big/Small", "Odd/Even": "Odd/Even", "P/C": "P/C" },
  "2nd": { "Big/Small": "Big/Small", "Odd/Even": "Odd/Even", "P/C": "P/C" },
  "3rd": { "Big/Small": "Big/Small", "Odd/Even": "Odd/Even", "P/C": "P/C" },
  "4th": { "Big/Small": "Big/Small", "Odd/Even": "Odd/Even", "P/C": "P/C" },
  "5th": { "Big/Small": "Big/Small", "Odd/Even": "Odd/Even", "P/C": "P/C" },
};
function RoadBet() {
  //   const [activePlaceCheckBox,setActivePlaceCheckBox] = useState([])
  const [activePlaceCheckBox, setActivePlaceCheckBox] = useState<string[]>([]);
  const [placeCheckBox, setPlaceCheckBox] = useState<{ [key: string]: any }>(
    {}
  );
  const [formCheckBox, setFormCheckBox] = useState<boolean>(true);
  // const card: string[] = ["1st", "2nd", "3rd", "4th", "5th", "sum"];

  const [data, setData] = useState<Record<string, TreeType>>({
    "1st": [],
    "2nd": [],
    "3rd": [],
    "4th": [],
    "5th": [],
    sum: [],
  });
  const [percent, setPercentage] = useState<Record<string, PercentageType>>({});
  const [colWidth, setColWidth] = useState<Record<string, ColWidthType>>({});
  const [bigRoadData, setBigRoadData] = useState<Record<string, BigBoyType>>(
    {}
  );
  const [showSmallRoad, setShowSmallRoad] = useState<boolean>(false);
  const [cockroachData, setCockroachData] = useState<
    Record<string, CockroachType>
  >({});
  const [smallRoadData, setSmallRoadData] = useState<
    Record<string, SmallRoadType>
  >({});
  const [nextColor, setNextColor] = useState<Record<string, NextColorType>>({});
  const [aa, bb] = useState<Record<string, any>>({});
  const [isBlinking, setIsBlinking] = useState(false);
  const [roadForms, setRoadForms] = useState<any[]>([]);
  const [roadFormsColor, setRoadFormsColor] = useState<string>("");
  // const [amount, setAmount] = useState<number>(1);

  const {
    roadBetSelections,
    roadBetDispatch,
    drawData,
    isInitialRender,
    setIsInitialRender,
    lotteryData,
    rebate,
    drawNumbers,
    roadBetInfo
  }: any = MainStateProvider();
  const { multiplier, inputValues, setInputValues }: any =
    useRoadBetControlBoard();
  const checkColor = {
    R: "B",
    B: "R",
  };
  const [allselect, setAllSelect] = useState(false);

  function toggleBlinking() {
    setIsBlinking((prev) => !prev);

    if (!isBlinking) {
      startBlinkingAnimation();
    }
  }

  function startBlinkingAnimation() {
    let visible = false;

    const blink = () => {
      visible = !visible;
      setIsBlinking(visible);
      // requestAnimationFrame(blink);
    };

    blink();

    // Stop the blinking animation after a certain time or when needed
    setTimeout(() => {
      setIsBlinking(false);
    }, 5000); // Stop blinking after 5 seconds (adjust as needed)
  }

  // const fetchDrawNumbers = async () => {
  //   // const res: any = await fetcher(road_draws_url);
  //   const [roadBetDrawNumbers, roadBetInfo]: any = await Promise.all([
  //     fetcher(`${road_draws_url}?lottery_id=${lotteryData.lottery_id}`),
  //     fetcher(roadbet_info_url),
  //   ]);
  //   return { roadBetDrawNumbers, roadBetInfo };
  // };
  // useEffect(async() => {
  //     let {data} =
  //     await fetcher((road_draws_url).then((res) => {
  //         console.log("roooooaddddddddddd", res.data)
  //         data = res.data.reverse()
  //         console.log("roooooaddddddddddd", data)
  //         setDrawNumbers(data)
  //     })
  // }, [drawData])
  // useEffect(() => {
  //   const getDrawNumbers = async () => {
  //     // const { roadBetDrawNumbers, roadBetInfo } = await fetchDrawNumbers();

  //     if (isInitialRender.isInitialRenderRoadBet) {
  //       const { roadBetDrawNumbers, roadBetInfo } = await fetchDrawNumbers();
  //       console.log("roooooaddddddddddd", roadBetInfo.data);
  //       console.log(
  //         "roooooaddddddddddd first",
  //         roadBetDrawNumbers.data.reverse()
  //       );
  //       setDrawNumbers(roadBetDrawNumbers.data.reverse());
  //       // setDrawNumbers(drawNumbers);
  //       setRoadBetInfo(roadBetInfo.data);
  //     } else {
  //       const { data: roadBetDrawNumbers }: any = await fetcher(
  //         `${road_draws_url}?lottery_id=${lotteryData.lottery_id}`
  //       );
  //       // set state
  //       console.log("roooooaddddddddddd second", roadBetDrawNumbers);
  //       setDrawNumbers(roadBetDrawNumbers.reverse());
  //     }
  //     // isInitialRender
  //     // setIsInitialRender
  //     if (isInitialRender.isInitialRenderRoadBet) {
  //       setIsInitialRender({
  //         ...isInitialRender,
  //         isInitialRenderRoadBet: false,
  //       });
  //     }

  //     // if (isMounted) {
  //     //   setDrawNumbers(roadBetDrawNumbers.data.reverse());
  //     //   // setDrawNumbers(drawNumbers);
  //     //   setRoadBetInfo(roadBetInfo.data);
  //     // }
  //   };

  //   getDrawNumbers();

  //   // return () => {
  //   //   isMounted = false;
  //   // };
  // }, [drawData.nextBetId]);

  function sortPlaceCheckBox(): { [key: string]: any } {
    const sortedKeys = Object.keys(placeCheckBox).sort((a, b) =>
      a.localeCompare(b)
    );

    const sortedPlaceCheckBox: { [key: string]: any } = {};
    sortedKeys.forEach((key) => {
      sortedPlaceCheckBox[key] = placeCheckBox[key];
    });

    return sortedPlaceCheckBox;
  }

  useEffect(() => {
    let mainTree: Record<string, TreeType> = {};
    let percentage: Record<string, PercentageType> = {};
    let columnWidth: Record<string, ColWidthType> = {};
    let bigBoy: Record<string, BigBoyType> = {};
    let cockroach: Record<string, CockroachType> = {};
    let smallRoad: Record<string, SmallRoadType> = {};
    let nextColor: Record<string, NextColorType> = {};
    const timerStart = performance.now();

    !isEmpty(placeCheckBox) &&
      Object.keys(placeCheckBox)
        .sort((a: any, b: any) => a - b)
        .forEach((card) => {
          activePlaceCheckBox.forEach((form) => {
            console.log("form card", form, card);
            let trees: TreeType | undefined;
            let _percent: PercentageType | undefined;
            let _colWidth: ColWidthType | undefined;
            let _bigBoy: BigBoyType | undefined;
            let _cockroach: CockroachType | undefined;
            let _smallRoad: SmallRoadType | undefined;
            let _nextColor: NextColorType | undefined;
            // if (form === "Dragon/Tiger") {
            //   const dragonTigerTree = buildDragonTigerTree(
            //     drawNumbers,
            //     card,
            //     form
            //   );
            //   trees = dragonTigerTree.tree;
            //   _percent = dragonTigerTree.percentage;
            //   _colWidth = dragonTigerTree.colWidth;
            //   _bigBoy = dragonTigerTree.bigBoy;
            //   _cockroach = dragonTigerTree.cockroach;
            //   _smallRoad = dragonTigerTree.smallRoad;
            //   _nextColor = dragonTigerTree.nextColor;
            // } else {
            const regularTree = buildTree(drawNumbers, card, form);
            trees = regularTree.tree;
            _percent = regularTree.percentage;
            _colWidth = regularTree.colWidth;
            _bigBoy = regularTree.bigBoy;
            _cockroach = regularTree.cockroach;
            _smallRoad = regularTree.smallRoad;
            _nextColor = regularTree.nextColor;
            // }

            if (
              trees &&
              _percent &&
              _colWidth &&
              _bigBoy &&
              _cockroach &&
              _smallRoad &&
              _nextColor
            ) {
              mainTree[form + "|" + card] = trees;
              percentage[form + "|" + card] = _percent;
              columnWidth[form + "|" + card] = _colWidth;
              bigBoy[form + "|" + card] = _bigBoy;
              cockroach[form + "|" + card] = _cockroach;
              smallRoad[form + "|" + card] = _smallRoad;
              nextColor[form + "|" + card] = _nextColor;
              console.log("mainTree", _bigBoy);
            }
          });
        });
    console.log("mainTree", mainTree);
    setData(mainTree);
    setPercentage(percentage);
    setColWidth(columnWidth);
    setBigRoadData(bigBoy);
    setCockroachData(cockroach);
    setSmallRoadData(smallRoad);
    setNextColor(nextColor);

    bb(sortPlaceCheckBox());

    const timerEnd = performance.now();
    const elapsedTime = timerEnd - timerStart;
    const seconds = (elapsedTime / 1000).toFixed(2);
    console.log(`Code execution time: ${seconds} seconds`);
  }, [activePlaceCheckBox, placeCheckBox, drawNumbers]);

  const formPlaceHolders: PlaceCheckBox = {
    Sum: { "Big/Small": {}, "Odd/Even": {}, "Dragon/Tiger": {} },
    FixedPlace: { "Big/Small": {}, "Odd/Even": {}, "P/C": {} },
  };

  function selectPlaceCheckBox(y: string) {
    console.log("yyyyyyyy", y);
    //  y is sum | 1st | 2nd | 3rd | 4th | 5th
    if (placeCheckBox.hasOwnProperty(y)) {
      const updatedPlaceCheckBox = { ...placeCheckBox };
      console.log("yyyyyyyy", updatedPlaceCheckBox);

      delete updatedPlaceCheckBox[y];
      setPlaceCheckBox(updatedPlaceCheckBox);
    } else {
      if (y !== "Sum") {
        const updatedPlaceCheckBox = {
          ...placeCheckBox,
          [y]: { ...formPlaceHolders["FixedPlace"] },
        };
        setPlaceCheckBox(updatedPlaceCheckBox);
        setFormCheckBox(!formCheckBox);
        return;
      }
      const updatedPlaceCheckBox = {
        ...placeCheckBox,
        [y]: { ...formPlaceHolders[y] },
      };
      setPlaceCheckBox(updatedPlaceCheckBox);
      setFormCheckBox(!formCheckBox);
      // console.log("yyyy",activePlaceCheckBox)
    }
  }

  useEffect(() => {
    console.log("aaaaaactivePlaceCheckBox  ", activePlaceCheckBox);
    console.log("aaaaaplaceCheckBox  ", placeCheckBox);
  }, [activePlaceCheckBox, placeCheckBox]);

  function selectFormCheckBox(place: string) {
    if (!activePlaceCheckBox.includes(place)) {
      const updatedActivePlaceCheckBox = [...activePlaceCheckBox, place];
      setActivePlaceCheckBox(updatedActivePlaceCheckBox);
    } else {
      const updatedActivePlaceCheckBox = activePlaceCheckBox.filter(
        (activePlace) => activePlace !== place
      );
      Object.keys(placeCheckBox).forEach((x) => {
        if (x === "Sum" && place === "P/C") return;
        if (x !== "Sum" && place === "Dragon/Tiger") return;
        placeCheckBox[x][place] = {};
      });
      setActivePlaceCheckBox(updatedActivePlaceCheckBox);
    }
  }

  function generateGridJSON(numbersCategory: NumbersCategory) {
    setPlaceCheckBox((prevPlaceCheckBox) => {
      // Create a copy of the previous state
      const updatedPlaceCheckBox: PlaceCheckBoxState = { ...prevPlaceCheckBox };

      Object.keys(updatedPlaceCheckBox).forEach((key) => {
        if (key === "Sum" && numbersCategory === "P/C") return;
        if (key !== "Sum" && numbersCategory === "Dragon/Tiger") return;

        // Update the specific property within the nested object
        updatedPlaceCheckBox[key] = {
          ...updatedPlaceCheckBox[key],
          [numbersCategory]: numbersCategory,
        };
      });

      return updatedPlaceCheckBox; // Return the updated state
    });
  }

  useEffect(() => {
    if (activePlaceCheckBox.length > 0) {
      activePlaceCheckBox.forEach((place) => {
        generateGridJSON(place);
      });
    }
  }, [activePlaceCheckBox, formCheckBox]);

  return (
    <div className={styles.container}>
      <div className={styles.overflow}>
        <div className={styles.ing}>
          <div className={styles.tre}>
            <div className={styles.flow}>
              <div className={styles.ccg}> Place</div>{" "}
              {
                listData.map((x) =>
                  x.place.map((y, z) => (
                    <div key={z} className={styles.uio}>
                      {" "}
                      <input
                        type="checkbox"
                        id={`place_checkbox${y}`}
                        checked={placeCheckBox.hasOwnProperty(y)}
                        onChange={(e) => selectPlaceCheckBox(y)}
                      />{" "}
                      <label htmlFor={`place_checkbox${y}`}>{y}</label>
                    </div>
                  ))
                )[0]
              }
            </div>
          </div>
          <div className={styles.tre}>
            <div className={styles.flow}>
              <div className={styles.ccg}> Form</div>{" "}
              {
                listData.map((x) =>
                  x.form.map((y, z) => (
                    <div key={z} className={styles.uio}>
                      <input
                        type="checkbox"
                        id={`form_checkbox${y}`}
                        onChange={() => selectFormCheckBox(y)}
                        checked={activePlaceCheckBox.includes(y)}
                      />{" "}
                      <label htmlFor={`form_checkbox${y}`}>{y}</label>
                    </div>
                  ))
                )[0]
              }
            </div>
          </div>
        </div>
        <div className={styles.flop}>
          <button
            style={{
              background: allselect ? "#ED712E" : "",
              color: allselect ? "#fff" : "",
            }}
            className={styles.all}
            onClick={() => {
              setPlaceCheckBox(selectAllObjects);
              setActivePlaceCheckBox([
                "Big/Small",
                "Odd/Even",
                "Dragon/Tiger",
                "P/C",
              ]);
              console.log("yyyyy", activePlaceCheckBox);
              setAllSelect(true);
            }}
          >
            All
          </button>
          <button
            style={
              {
                // background: allselect ? "#ED712E" : "#2C3E5D",
                // color: allselect ? "#fff" : "#fff",
              }
            }
            className={styles.all}
            onClick={() => {
              setPlaceCheckBox({});
              setActivePlaceCheckBox([]);
              setAllSelect(false);
            }}
          >
            Clear
          </button>
        </div>
        <div className={styles.gopy}>
          <button
            className={styles.borp1}
            onClick={() => {
              console.log("lastCell", ["B", "O", "D", "P"]);
              setRoadForms(["B", "O", "D", "P"]);
              setRoadFormsColor("R");
              toggleBlinking();
            }}
          >
            B,O,D,P 
          </button>
          <button
            className={styles.borp2}
            onClick={() => {
              console.log("lastCell", ["S", "E", "T", "C"]);
              setRoadForms(["S", "E", "T", "C"]);
              setRoadFormsColor("B");
              toggleBlinking();
            }}
          >
            S,E,T,C 
          </button>
          <div className={styles.glop}>
            <div className={styles.kju}>
              <input
                type="checkbox"
                id="small_road"
                onChange={() => setShowSmallRoad((prev) => !prev)}
              />
            </div>
            <label htmlFor="small_road" className={styles.kju}>
              Small Road
            </label>
          </div>
        </div>
      </div>
      {Object.keys(aa).length > 0 ? (
       
          <div className={styles.flowmainbox}>
            {Object.keys(aa).map((_key, index) => {
              let placeCheckBoxObjValues: any =
                !isEmpty(placeCheckBox[_key]) &&
                Object.values(placeCheckBox[_key]).filter(
                  (item) => typeof item === "string"
                );
              if (placeCheckBoxObjValues.length > 0) {
                return (
                  <div key={index}>
                    {placeCheckBoxObjValues.map((_form: string, i: number) => {
                      return (
                        <div className={styles.contain} key={i}>
                          <div className={styles.dashes}>
                            <div className={styles.head}>
                              <div className={styles.nv}>
                                <span className={styles.places}>{_key}</span> -{" "}
                                <span className={styles.form}>{_form}</span>
                              </div>
                              <div className={styles.nv}>
                                {!isEmpty(percent?.[_form + "|" + _key]) &&
                                  Object.keys(
                                    percent?.[_form + "|" + _key]
                                  ).map((key, index) => (
                                    <span
                                      className={`${styles.drt} form`}
                                      style={{
                                        color: ["B", "O", "P", "D"].includes(
                                          key
                                        )
                                          ? "red"
                                          : "blue",
                                      }}
                                      key={index}
                                    >
                                      {`${key}: ${
                                        percent?.[_form + "|" + _key][key]
                                      } `}
                                    </span>
                                  ))}
                              </div>
                              <div
                                className={`${styles.nv} ${styles.derivedRoad}`}
                              >
                                {!isEmpty(percent?.[_form + "|" + _key]) &&
                                  Object.keys(
                                    percent?.[_form + "|" + _key]
                                  ).map((key, index) => {
                                    const derivedRoadSection = Object.keys(
                                      nextColor?.[_form + "|" + _key] ?? {}
                                    );
                                    return (
                                      <DerivedRoadColorsSection
                                        key={index}
                                        keyName={key}
                                        derivedRoadSection={derivedRoadSection}
                                        nextColor={nextColor}
                                        _key={_key}
                                        _form={_form}
                                        checkColor={checkColor}
                                      />
                                    );
                                  })}
                              </div>
                            </div>
                            <div className={styles.grew}>
                              <MainRoad
                                card={_key}
                                colWidth={colWidth[_form + "|" + _key]}
                                form={_form}
                                data={data}
                              />

                              <div className={styles.jkuyt}>
                                {roadBetInfo.map((roadBetInfo, index) => {
                                  const { gn_id, group_type, odds, name } =
                                    roadBetInfo;
                                  const { sub_game }: any = roadBetInfo;
                                  const gameSelectOptions =
                                    group_type.split("/");
                                  const selectionOne =
                                    gameSelectOptions[0] === "P"
                                      ? "Prime"
                                      : gameSelectOptions[0];
                                  const selectionTwo =
                                    gameSelectOptions[1] === "C"
                                      ? "Composite"
                                      : gameSelectOptions[1];
                                  return (
                                    <div key={gn_id}>
                                      {name === _key &&
                                        group_type === _form && (
                                          <div
                                            // style={{
                                            //   display:
                                            //     gn_id === 14 ? "grid" : "",
                                            //   gridTemplateColumns:
                                            //     gn_id === 14 ? "1fr" : "",
                                            // }}
                                            className={styles.inbox_match}
                                          >
                                            <div
                                              className={`${styles.jgddwqs} ${
                                                roadBetSelections?.[_key]?.[
                                                  gn_id
                                                ]?.hasOwnProperty(
                                                  selectionOne
                                                ) && styles.selected
                                              }`}
                                              onClick={() => {
                                                inputValues[
                                                  `${name}-${selectionOne}`
                                                ] = roadBetSelections?.[_key]?.[
                                                  gn_id
                                                ]?.hasOwnProperty(selectionOne)
                                                  ? ""
                                                  : multiplier;
                                                setInputValues(inputValues);

                                                const amount =
                                                  roadBetSelections?.[_key]?.[
                                                    gn_id
                                                  ]?.hasOwnProperty(
                                                    selectionOne
                                                  )
                                                    ? ""
                                                    : multiplier;
                                                roadBetDispatch({
                                                  type: ROAD_BET_ACTION_TYPES.ADD_ROAD,
                                                  payload: {
                                                    userSelection: selectionOne,
                                                    game_name: _key,
                                                    amount: amount,
                                                    game_id: gn_id,
                                                  },
                                                });
                                              }}
                                            >
                                              <div
                                                id={styles.nn}
                                                className={styles.nnn}
                                              >
                                                {selectionOne}
                                               
                                              </div>
                                              <div
                                                  id={styles.nn}
                                                  className={styles.nnn}
                                                >
                                                  {gn_id == 14 ? calculatedUserPrize(sub_game[0].odds, 1, rebate): calculatedUserPrize(odds, 1, rebate)} 
                                                </div>
                                              <div className={styles.shiftdown}>
                                                {/* <div id={styles.oo} className={styles.nnn}>
                                          {odds}
                                        </div> */}
                                                <div className={styles.nnn}>
                                                  <input
                                                    className={`${styles.inpo} ${name}-${selectionOne}`}
                                                    type={"text"}
                                                    onClick={(e) =>
                                                      e.stopPropagation()
                                                    }
                                                    value={
                                                      // Object.values(roadBetSelections).length > 0 && roadBetSelections?.[_key]?.hasOwnProperty(gn_id)
                                                      // ? inputValues[`${`${name}`}-${selectionOne}`]
                                                      // :  "" || ""
                                                      inputValues?.[
                                                        `${name}-${selectionOne}`
                                                      ] ?? ""
                                                    }
                                                    onChange={(
                                                      e: ChangeEvent<HTMLInputElement>
                                                    ) => {
                                                      const { value }: any =
                                                        e.target;
                                                      if (isNaN(+value)) return;

                                                      const limitedValue =
                                                        value.replace(
                                                          /[^0-9.]/g,
                                                          ""
                                                        );
                                                      let acceptedAmt =
                                                        limitedValue > 99999
                                                          ? 99999
                                                          : limitedValue;
                                                      setInputValues(
                                                        (prevValues: any) => ({
                                                          ...prevValues,
                                                          [`${name}-${selectionOne}`]:
                                                            acceptedAmt,
                                                        })
                                                      );
                                                      roadBetDispatch({
                                                        type: ROAD_BET_ACTION_TYPES.ADD_ROAD,
                                                        payload: {
                                                          userSelection:
                                                            selectionOne,
                                                          game_name: _key,
                                                          amount: acceptedAmt,
                                                          game_id: gn_id,
                                                        },
                                                      });
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              className={`${styles.jgddwqs} ${
                                                roadBetSelections?.[_key]?.[
                                                  gn_id
                                                ]?.hasOwnProperty(
                                                  selectionTwo
                                                ) && styles.selected
                                              }`}
                                              style={{ background: "ed" }}
                                              onClick={() => {
                                                inputValues[
                                                  `${name}-${selectionTwo}`
                                                ] = roadBetSelections?.[_key]?.[
                                                  gn_id
                                                ]?.hasOwnProperty(selectionTwo)
                                                  ? ""
                                                  : multiplier;
                                                setInputValues(inputValues);

                                                const amount =
                                                  roadBetSelections?.[_key]?.[
                                                    gn_id
                                                  ]?.hasOwnProperty(
                                                    selectionTwo
                                                  )
                                                    ? ""
                                                    : multiplier;
                                                roadBetDispatch({
                                                  type: ROAD_BET_ACTION_TYPES.ADD_ROAD,
                                                  payload: {
                                                    userSelection: selectionTwo,
                                                    game_name: _key,
                                                    amount: amount,
                                                    game_id: gn_id,
                                                  },
                                                });
                                              }}
                                            >
                                              <div id={styles.nn} className={styles.nnn}>
                                                {selectionTwo} 
                                              </div>
                                              <div id={styles.nn} className={styles.nnn}>
                                                  {gn_id == 14 ? calculatedUserPrize(sub_game[1].odds, 1, rebate): calculatedUserPrize(odds, 1, rebate)}
                                                </div>
                                              <div className={styles.shiftdown}>
                                                {/* 
                                                <span id={styles.oo} className={styles.nnn}>
                                                  {odds} 
                                                </span> 
                                                */}
                                                <div className={styles.nnn}>
                                                  <input
                                                    className={`${styles.inpo} ${name}-${selectionTwo}`}
                                                    type={"text"}
                                                    onClick={(e) =>
                                                      e.stopPropagation()
                                                    }
                                                    value={
                                                      // Object.values(roadBetSelections).length > 0 && roadBetSelections?.[_key]?.hasOwnProperty(gn_id)
                                                      // ? inputValues[`${`${name}`}-${selectionTwo}`]
                                                      // : "" || ""
                                                      inputValues?.[
                                                        `${name}-${selectionTwo}`
                                                      ] ?? ""
                                                    }
                                                    onChange={(
                                                      e: ChangeEvent<HTMLInputElement>
                                                    ) => {
                                                      const { value }: any =
                                                        e.target;
                                                      if (isNaN(+value)) return;

                                                      const limitedValue =
                                                        value.replace(
                                                          /[^0-9.]/g,
                                                          ""
                                                        );
                                                      let acceptedAmt =
                                                        limitedValue > 99999
                                                          ? 99999
                                                          : limitedValue;
                                                      setInputValues(
                                                        (prevValues: any) => ({
                                                          ...prevValues,
                                                          [`${name}-${selectionTwo}`]:
                                                            acceptedAmt,
                                                        })
                                                      );
                                                      roadBetDispatch({
                                                        type: ROAD_BET_ACTION_TYPES.ADD_ROAD,
                                                        payload: {
                                                          userSelection:
                                                            selectionTwo,
                                                          game_name: _key,
                                                          amount: acceptedAmt,
                                                          game_id: gn_id,
                                                        },
                                                      });
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            {group_type === "Dragon/Tiger" && (
                                              <div
                                                className={`${styles.jgddwqs} ${
                                                  roadBetSelections?.[_key]?.[
                                                    gn_id
                                                  ]?.hasOwnProperty(
                                                    sub_game[2]?.label
                                                  ) && styles.selected
                                                }`}
                                                // style={{ background: "ed" }}
                                                onClick={() => {
                                                  inputValues[
                                                    `${name}-${sub_game[2]?.label}`
                                                  ] = roadBetSelections?.[
                                                    _key
                                                  ]?.[gn_id]?.hasOwnProperty(
                                                    sub_game[2]?.label
                                                  )
                                                    ? ""
                                                    : multiplier;
                                                  setInputValues(inputValues);

                                                  const amount =
                                                    roadBetSelections?.[_key]?.[
                                                      gn_id
                                                    ]?.hasOwnProperty(
                                                      sub_game[2]?.label
                                                    )
                                                      ? ""
                                                      : multiplier;
                                                  roadBetDispatch({
                                                    type: ROAD_BET_ACTION_TYPES.ADD_ROAD,
                                                    payload: {
                                                      userSelection:
                                                        sub_game[2]?.label,
                                                      game_name: _key,
                                                      amount: amount,
                                                      game_id: gn_id,
                                                    },
                                                  });
                                                }}
                                              >
                                                <div id={styles.nn} className={styles.nnn}>
                                                  {sub_game[2]?.label}
                                                </div>
                                                <div id={styles.nn} className={styles.nnn}>
                                                   {calculatedUserPrize(sub_game[2]?.odds, 1, rebate)} 
                                                  </div>
                                                <div
                                                  className={styles.shiftdown}
                                                >
                                                  {/* <span id={styles.oo} className={styles.nnn}>
                                              {sub_game[2]?.odds}
                                            </span> */}
                                                  <span className={styles.nnn}>
                                                    <input
                                                      style={{
                                                        width: "200%",
                                                        marginTop: 5,
                                                      }}
                                                      className={`${styles.inpo} ${name}-${sub_game[2]?.label}`}
                                                      type={"text"}
                                                      onClick={(e) =>
                                                        e.stopPropagation()
                                                      }
                                                      value={
                                                        // Object.values(roadBetSelections).length > 0 && roadBetSelections?.[_key]?.hasOwnProperty(gn_id)
                                                        // ? inputValues[`${`${name}`}-${gameSelectOptions[1]}`]
                                                        // : "" || ""
                                                        inputValues?.[
                                                          `${name}-${sub_game[2]?.label}`
                                                        ] ?? ""
                                                      }
                                                      onChange={(
                                                        e: ChangeEvent<HTMLInputElement>
                                                      ) => {
                                                        const { value }: any =
                                                          e.target;
                                                        if (isNaN(+value))
                                                          return;

                                                        const limitedValue =
                                                          value.replace(
                                                            /[^0-9.]/g,
                                                            ""
                                                          );
                                                        let acceptedAmt =
                                                          limitedValue > 99999
                                                            ? 99999
                                                            : limitedValue;
                                                        setInputValues(
                                                          (
                                                            prevValues: any
                                                          ) => ({
                                                            ...prevValues,
                                                            [`${name}-${sub_game[2]?.label}`]:
                                                              acceptedAmt,
                                                          })
                                                        );
                                                        roadBetDispatch({
                                                          type: ROAD_BET_ACTION_TYPES.ADD_ROAD,
                                                          payload: {
                                                            userSelection:
                                                              sub_game[2]
                                                                ?.label,
                                                            game_name: _key,
                                                            amount: acceptedAmt,
                                                            game_id: gn_id,
                                                          },
                                                        });
                                                      }}
                                                    />
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {!showSmallRoad && (
                              <div className={styles.grew2}>
                                {/* { JSON.stringify(isBlinking)} */}
                                <DerivedRoads
                                  card={_key}
                                  colWidth={
                                    bigRoadData?.[_form + "|" + _key]?.[
                                      "colWidth"
                                    ]
                                  }
                                  form={_form}
                                  data={bigRoadData}
                                  derivedRoadType={"bigeyeboy"}
                                  // drawNumbers={drawNumbers}
                                  isBlinking={isBlinking}
                                  // toggleBlinking={toggleBlinking}
                                  roadFormsColor={roadFormsColor}
                                  roadForms={roadForms}
                                />
                                <DerivedRoads
                                  card={_key}
                                  colWidth={
                                    cockroachData?.[_form + "|" + _key]?.[
                                      "colWidth"
                                    ]
                                  }
                                  form={_form}
                                  data={cockroachData}
                                  derivedRoadType={"cockroachpig"}
                                  // drawNumbers={drawNumbers}
                                  isBlinking={isBlinking}
                                  // toggleBlinking={()=>toggleBlinking()}
                                  // toggleBlinking={toggleBlinking}
                                  roadFormsColor={roadFormsColor}
                                  roadForms={roadForms}
                                />
                                <DerivedRoads
                                  card={_key}
                                  colWidth={
                                    smallRoadData?.[_form + "|" + _key]?.[
                                      "colWidth"
                                    ]
                                  }
                                  form={_form}
                                  data={smallRoadData}
                                  derivedRoadType={"smallroad"}
                                  // drawNumbers={drawNumbers}
                                  isBlinking={isBlinking}
                                  // toggleBlinking={toggleBlinking}
                                  roadFormsColor={roadFormsColor}
                                  roadForms={roadForms}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
            })}
          </div>
        
      ) : (
        <div className={styles.flowise}>
          <center>
            <div className={styles.mnrt}>
              <LuLassoSelect
                style={{ marginTop: 120 }}
                color="#db6211"
                size={50}
              />
              <h1>Make a Selection</h1>
              <p>
                Please select an item from the left to see the results here.
              </p>
            </div>
          </center>
        </div>
      )}
      <ControlBoard />
    </div>
  );
}
export default RoadBet;

function getBigSmallForBall(ball: number) {
  return ball >= 0 && ball <= 4 ? "S" : "B";
}

function firstAndLast(arr: string | any[]) {
  if (arr.length === 0) {
    return []; // Return an empty array for an empty input array.
  }

  const first = arr[0];
  const last = arr[arr.length - 1];

  return [first, last];
}

// Helper functions
function getOddEven(num: number) {
  return num % 2 === 0 ? "E" : "O";
}

function getBigSmallForSum(sum: number) {
  return sum >= 23 && sum <= 45 ? "B" : "S";
}

function getDragonTiger(lastTwo: any[]) {
  if (lastTwo[0] > lastTwo[1]) {
    return "D";
  } else if (lastTwo[0] < lastTwo[1]) {
    return "T";
  } else {
    return "A";
  }
}

function getPrimeComposite(ball: number) {
  const primes = [1, 2, 3, 5, 7];

  if (primes.includes(ball)) {
    return "P";
  } else {
    return "C";
  }
}

function analyzeDrawNumbers(
  drawNumbers: number[][],
  whatToAnalyze: string
): any {
  const results: AnalysisResults = {
    "Big/Small": [],
    "Odd/Even": [],
    "P/C": [],
    "Dragon/Tiger": [],
  };

  for (const element of drawNumbers) {
    const draw: number[] = element;

    let ball: number;
    if (whatToAnalyze.toLowerCase() === "sum") {
      ball = draw.reduce((a, b) => a + b, 0);
    } else {
      ball = draw[parseInt(whatToAnalyze) - 1];
    }

    let oddEven: string,
      bigSmall: string,
      primeComposite: string,
      dragonTiger: string;

    if (whatToAnalyze.toLowerCase() === "sum") {
      oddEven = getOddEven(ball);
      bigSmall = getBigSmallForSum(ball);

      const lastTwo = firstAndLast(draw);
      dragonTiger = getDragonTiger(lastTwo);
      results["Dragon/Tiger"].push(dragonTiger);
    } else {
      oddEven = getOddEven(ball);
      bigSmall = getBigSmallForBall(ball);

      primeComposite = getPrimeComposite(ball);
      results["P/C"].push(primeComposite);
    }

    results["Big/Small"].push(bigSmall);
    results["Odd/Even"].push(oddEven);
  }

  return results;
}

const countOccurrences = (
  arr: string[],
  type: string
): { [key: string]: string } => {
  const letterMapping: { [key: string]: string[] } = {
    "Big/Small": ["B", "S"],
    "Odd/Even": ["O", "E"],
    "P/C": ["P", "C"],
    "Dragon/Tiger": ["D", "T"],
  };
  const letter = letterMapping[type]; //|| ["D", "T"];

  const counts: { [key: string]: number } = { [letter[0]]: 0, [letter[1]]: 0 };

  arr.forEach((item) => {
    counts[item]++;
  });

  const total = arr.length;
  return {
    [letter[0]]: isNaN(Number(((counts[letter[0]] / total) * 100).toFixed(0)))
      ? 0 + "%"
      : ((counts[letter[0]] / total) * 100).toFixed(0) + "%",
    [letter[1]]: isNaN(Number(((counts[letter[1]] / total) * 100).toFixed(0)))
      ? 0 + "%"
      : ((counts[letter[1]] / total) * 100).toFixed(0) + "%",
  };
};

/**
 * Build a tree structure from draw numbers and analyze the results for a given type.
 *
 * @param drawNumbers - The array of draw numbers to analyze.
 * @param whatToAnalyze - The aspect of the draw numbers to analyze (e.g., "Sum").
 * @param type - The type of analysis (e.g., "Big/Small").
 * @returns An object containing the tree structure, percentage, column width, derived roads, and color information.
 */

function buildTree(
  drawNumbers: number[][],
  whatToAnalyze: string,
  type: string
): {
  tree: number[][];
  percentage: Record<string, string>;
  colWidth: number;
  bigBoy: any;
  smallRoad: any;
  cockroach: any;
  nextColor: Record<string, any>;
} {
  const tree: number[][] = [];
  const analyzedResults = analyzeDrawNumbers(drawNumbers, whatToAnalyze)[type];
  let percentage = countOccurrences(analyzedResults, type);

  const bigEyeBoyArr: string[] = [];
  const smallRoadArr: string[] = [];
  const cockroachArr: string[] = [];
  const bigEyeRoadObj: Record<string, any> = {};
  const smallRoadObj: Record<string, any> = {};
  const cockroachObj: Record<string, any> = {};

  let row = 0;
  let col = 0;
  let whenColIncreaseByMaxRows = 0;
  const dua: Record<string, any> = {};

  // analyzedResults.forEach((currentLetter: any, i: number) => {
  //   const previousLetter = analyzedResults[i - 1];
  //   const nextLetter = analyzedResults[i + 1];
  //   const newItem: number[] = [];

  //   if (currentLetter !== previousLetter) {
  //     col = whenColIncreaseByMaxRows;
  //   }

  //   if (previousLetter !== undefined && currentLetter !== previousLetter) {
  //     row = 0;
  //     col++;
  //     if (row === 0) {
  //       whenColIncreaseByMaxRows = col;
  //     }
  //   } else if (currentLetter === previousLetter) {
  //     row++;

  //     const prevCol = col - 1;
  //     const prev = dua[row + "|" + prevCol];

  //     if (prev === currentLetter) {
  //       row--;
  //       col++;
  //     }
  //   } else if (
  //     currentLetter !== previousLetter &&
  //     currentLetter !== nextLetter
  //   ) {
  //     col = 0;
  //     whenColIncreaseByMaxRows = col;
  //   }

  //   if (row > 5) {
  //     row = 5;
  //     col++;
  //   }

  //   newItem.push(row, col, (currentLetter !== undefined) ? currentLetter : "");

  //   const duplicate = tree.some(
  //     (item) => item[0] === newItem[0] && item[1] === newItem[1]
  //   );

  //   if (duplicate) {
  //     row--;
  //     col++;
  //     newItem[0] = row;
  //     newItem[1] = col;
  //   }

  //   dua[row + "|" + col] = currentLetter;
  //   // console.log("dua", dua, currentLetter);
  //   tree.push(newItem);

  //   derivedRoad(tree as [number, number, string][], whenColIncreaseByMaxRows, {
  //     bigEyeBoyArr,
  //     smallRoadArr,
  //     cockroachArr,
  //     bigEyeRoadObj,
  //     smallRoadObj,
  //     cockroachObj
  //   });
  // });

  // const precedingAs = getPrecedingAs(road); // Get the preceding "A"s in the road.

  // // Handle cases where "A"s precede the road.
  // /* this if statement is to check if A's started the drawNumbers */
  // if (precedingAs.length) {
  //   for (let i = 0; i < precedingAs.length; i++) {
  //     const currentLetter = precedingAs[i];
  //     const nextLetter = road[i + 1];
  //     if (precedingAs[0] == "A" && i == 0) {
  //       row = 0;
  //       col = 0;
  //     } else {
  //       row++;
  //     }

  //     if (nextLetter != "A") {
  //       columnLeader = nextLetter;
  //     }

  //     if (row > maxNumberOfRows) {
  //       row = maxNumberOfRows;
  //       col++;
  //     }
  //     if (currentLetter === "A") {
  //       consecutiveAs++;
  //     } else {
  //       consecutiveAs = 0;
  //     }
  //     let newItem = [row, col, currentLetter];
  //     tree.push(newItem);
  //   }

  //   if (precedingAs.length === 1) {
  //     row = 1;
  //   }
  //   removePrecedingAs(road, precedingAs.length);
  // }

  const img = transpose(analyzedResults);
  console.log("img", img["newArr"]);
  img["newArr"].forEach((value, i) => {
    let previousLetter = img["newArr"][i - 1];
    let currentLetter = img["newArr"][i];
    let nextLetter = img["newArr"][i + 1];
    let newItem: any = [];

    if (currentLetter !== previousLetter) {
      col = whenColIncreaseByMaxRows;
    } //&& currentLetter !== letterinobj && countsinobj >= 2 row++
    if (previousLetter !== undefined && currentLetter !== previousLetter) {
      // if(currentLetter !== img["consecutiveAs"][`${previousLetter}${i}`] && countsinobj >= 2)
      if (
        type === "Dragon/Tiger" &&
        img["consecutiveAs"][`${previousLetter}${i}`] >= 2 &&
        previousLetter === "D"
      ) {
        // alert(currentLetter)
        row++;
      } else {
        row = 0;
        col++;
        if (row === 0) {
          whenColIncreaseByMaxRows = col;
        }
      }
    } else if (currentLetter === previousLetter) {
      row++;

      let prevCol = col - 1;
      const prev = dua[row + "|" + prevCol];

      if (prev === currentLetter && type !== "Dragon/Tiger") {
        row--;
        col++;
      }
    } else if (
      currentLetter !== previousLetter &&
      currentLetter !== nextLetter
    ) {
      col = 0;
      whenColIncreaseByMaxRows = col;
    }

    if (row > 5) {
      row = 5;
      col++;
    }
    // newItem = [row, col, currentLetter];
    newItem.push(row, col, currentLetter !== undefined ? currentLetter : "");

    let duplicate = tree.some(
      (item) => item[0] === newItem[0] && item[1] === newItem[1]
    );

    if (duplicate) {
      row--;
      col++;
      newItem = [row, col, currentLetter];
    }

    dua[row + "|" + col] = currentLetter;
    // console.log("indexof", img["indexOfA"])
    newItem = [row, col, img["indexOfA"].includes(i) ? "A" : currentLetter];

    // if(img["indexOfA"].includes(i)){
    //   countConsecutiveAs++; // count consecutive As
    //   if(countConsecutiveAs >= 2){
    //     row++;
    //     col--
    //     newItem = [row, col, img["indexOfA"].includes(i) ? "A" : currentLetter];
    //
    //   }else{
    //    newItem = [row, col, img["indexOfA"].includes(i) ? "A" : currentLetter];
    // }
    // generateDerivedRoadColors(tree, whenColIncreaseByMaxRows, { bigEyeBoyArr, smallRoadArr, cockcroachArr, bigEyeRoadObj });
    // console.log(newItem);
    tree.push(newItem);

    derivedRoad(tree as [number, number, string][], whenColIncreaseByMaxRows, {
      bigEyeBoyArr,
      smallRoadArr,
      cockroachArr,
      bigEyeRoadObj,
      smallRoadObj,
      cockroachObj,
    });
    // derivedRoad(tree, whenColIncreaseByMaxRows, { bigEyeBoyArr, smallRoadArr, cockcroachArr, bigEyeRoadObj });
  });
  const bigBoy = buildDerivedRoadTree(bigEyeBoyArr);
  const smallRoad = buildDerivedRoadTree(smallRoadArr);
  const cockroach = buildDerivedRoadTree(cockroachArr);

  return {
    tree,
    percentage,
    colWidth: col,
    bigBoy,
    smallRoad,
    cockroach,
    nextColor: { bigEyeRoadObj, smallRoadObj, cockroachObj },
  };
}

function convertAsToSucceedingLetter(arr: any[]) {
  const aSuccessor = findFirstNonA(arr);
  const preceedingAs = getPrecedingAs(arr);
  let count = 0;
  const indexesOfA = [];
  for (let i = 0; i < preceedingAs.length; i++) {
    arr[i] = aSuccessor;
    indexesOfA.push(i);
    count++;
  }
  return { arr, count, indexesOfA };
}

function findFirstNonA(arr: any[]) {
  let char = "";
  for (let i = 0; i < arr.length; i++) {
    char = arr[i];
    if (char !== "A") {
      return char;
    }
  }
}

function transpose(arr: any[]) {
  let newArr = [];
  let indexOfA: any = [];
  let countOfA = 0;
  const consecutiveAs: any = {};
  // const consecutiveAs = new Map();
  let previousLetter;

  // removePrecedingAs(arr, precedingAs.length);

  const aSuccessor = findFirstNonA(arr);
  const precedingAs = getPrecedingAs(arr).length;
  if (precedingAs > 0) {
    indexOfA = [...indexOfA, ...convertAsToSucceedingLetter(arr).indexesOfA];
    console.log("------------------>", indexOfA);
  }

  for (let i = 0; i < arr.length; i++) {
    let nextLetter = arr[i + 1];
    if (nextLetter === "A" && arr[i] !== "A") {
      previousLetter = arr[i];
    }
    // console.log("i", previousLetter, arr[i], previousLetter === undefined);
    if (arr[i] === "A" && previousLetter === undefined) {
      indexOfA.push(i);
      countOfA++;
      let nonAIndex = findNextNonALetterIndex(arr, i);
      // consecutiveAs.set(nextLetter, countOfA);
      consecutiveAs[`${nextLetter}${nonAIndex}`] = countOfA;

      newArr.push(nextLetter);
      countOfA = 0;
    } else if (arr[i] === "A") {
      countOfA++;
      let nonAIndex = findNextNonALetterIndex(arr, i);
      // consecutiveAs.set(`${previousLetter}${i}`, countOfA);
      consecutiveAs[`${previousLetter}${nonAIndex}`] = countOfA;
      indexOfA.push(i);
      newArr.push(previousLetter);
      // countOfA = 0;
    } else {
      countOfA = 0;
      newArr.push(arr[i]);
    }
  }

  console.log("i ", newArr);
  console.log("i ", countOfA);
  console.log("i ", consecutiveAs);
  console.log("i ", indexOfA);

  return { newArr, indexOfA, countOfA, consecutiveAs };
}

function findNextNonALetterIndex(arr: any[], currentIndexOfA: number) {
  for (let i = currentIndexOfA + 1; i < arr.length; i++) {
    if (arr[i] !== "A") {
      return i;
    }
  }
  // Return -1 if no non-'A' letter is found after the current index
  return -1;
}

/**
 * Build a tree structure from a derived road sequence.
 *
 * @param road - The array representing the derived road sequence.
 * @returns An object containing the tree structure and column width.
 */
function buildDerivedRoadTree(road: string[]): {
  tree: number[][];
  colWidth: number;
} {
  const tree: number[][] = [];
  let row = 0;
  let col = 0;
  let whenColIncreaseByMaxRows = 0;
  const dua: Record<string, string> = {};

  road.forEach((currentLetter, i) => {
    const previousLetter = road[i - 1];
    const nextLetter = road[i + 1];
    const newItem: any = [];
    //   const newItem:  [number, number, string] = [0, 0, ""];

    if (currentLetter !== previousLetter) {
      col = whenColIncreaseByMaxRows;
    }

    if (previousLetter !== undefined && currentLetter !== previousLetter) {
      row = 0;
      col++;
      if (row === 0) {
        whenColIncreaseByMaxRows = col;
      }
    } else if (currentLetter === previousLetter) {
      row++;

      const prevCol = col - 1;
      const prev = dua[row + "|" + prevCol];

      if (prev === currentLetter) {
        row--;
        col++;
      }
    } else if (
      currentLetter !== previousLetter &&
      currentLetter !== nextLetter
    ) {
      col = 0;
      whenColIncreaseByMaxRows = col;
    }

    if (row > 5) {
      row = 5;
      col++;
    }

    newItem.push(row, col, currentLetter);

    const duplicate = tree.some(
      (item) => item[0] === newItem[0] && item[1] === newItem[1]
    );

    if (duplicate) {
      row--;
      col++;
      newItem[0] = row;
      newItem[1] = col;
    }

    dua[row + "|" + col] = currentLetter;

    tree.push(newItem);
  });

  return { tree, colWidth: whenColIncreaseByMaxRows };
}

const check: any = {
  B: "S",
  S: "B",
  P: "C",
  C: "P",
  O: "E",
  E: "O",
  D: "T",
  T: "D",
};

/**
 * Retrieves a sequence of preceding 'A' characters from an array.
 *
 * @param arr - The array from which to extract the preceding 'A' characters.
 * @returns An array containing the sequence of preceding 'A' characters.
 */
function getPrecedingAs(arr: string[]): string[] {
  const result: string[] = [];
  let i = 0;

  // Keep going until we find a non-'A'
  while (i < arr.length && arr[i] === "A") {
    result.push(arr[i]);
    i++;
  }

  // Stop looping once we hit a non-'A'
  return result;
}

/**
 * Removes a specified number of preceding 'A' characters from an array.
 *
 * @param arr - The array from which to remove preceding 'A' characters.
 * @param numberOfAsToRemove - The number of preceding 'A' characters to remove.
 * @returns An array containing the removed 'A' characters.
 */
function removePrecedingAs(
  arr: string[],
  numberOfAsToRemove: number
): string[] {
  return arr.splice(0, numberOfAsToRemove);
}

/**
 * Gets the last array within a specific column that does not have the value "A".
 *
 * @param arr - The array to search in.
 * @param col - The column to search in.
 * @returns The last array without "A" in the specified column or the original array.
 */
function getLastArrayWithColWithoutA(
  arr: [number, number, string][],
  col: number
): [number, number, string] {
  let last: [number, number, string] | any = null;
  let lastIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i][1] === col) {
      last = arr[i];
      lastIndex = i;
    }
  }

  if (lastIndex !== -1 && last[2] === "A") {
    // Search for the predecessor that is not "A" within the same column.
    for (let i = lastIndex - 1; i >= 0; i--) {
      if (arr[i][1] === col && arr[i][2] !== "A") {
        // Create a new array with the modified value.
        return [last[0], last[1], arr[i][2]];
      }
    }
  }

  return last || [0, 0, ""]; // Return the original array if no modification is needed.
}

/**
 * Updates the state of various derived roads (Big Eye Boy, Small Road, and Cockroach Pig)
 * based on the current and previous elements in the tree.
 *
 * @param tree - The array representing the game tree.
 * @param col - The current column index in the tree.
 * @param bigEyeBoyArr - An array to store Big Eye Boy values.
 * @param smallRoadArr - An array to store Small Road values.
 * @param cockcroachArr - An array to store Cockroach Pig values.
 * @param bigEyeRoadObj - An object representing the state of the Big Eye Boy road.
 * @param smallRoadObj - An object representing the state of the Small Road.
 * @param cockroachObj - An object representing the state of the Cockroach Pig road.
 */
function derivedRoad(
  tree: [number, number, string][],
  col: number,
  {
    bigEyeBoyArr,
    smallRoadArr,
    cockroachArr,
    bigEyeRoadObj,
    smallRoadObj,
    cockroachObj,
  }: {
    bigEyeBoyArr: any[];
    smallRoadArr: any[];
    cockroachArr: any[];
    bigEyeRoadObj: Record<string, string>;
    smallRoadObj: Record<string, string>;
    cockroachObj: Record<string, string>;
  }
) {
  let getLastArrayWithCol2Var = getLastArrayWithColWithoutA(tree, col);
  let currentLetterCurrentCol =
    getLastArrayWithCol2Var != null && getLastArrayWithCol2Var[2]; // Current letter in the current column
  let nextLetterToBreakColumn =
    getLastArrayWithCol2Var != null && check[getLastArrayWithCol2Var[2]]; // Next letter to break the column

  let letter = (val: string) => (val === "R" ? "B" : "R");

  let updatedBigEyeRoadObj = { ...bigEyeRoadObj };
  let updatedSmallRoadObj = { ...smallRoadObj };
  let updatedCockroachObj = { ...cockroachObj };
  let bigEyeBoy = getLastArrayWithColWithoutA(tree, col - 1);
  let smallRoad = getLastArrayWithColWithoutA(tree, col - 2);
  let cockroach = getLastArrayWithColWithoutA(tree, col - 3);

  if (getLastArrayWithCol2Var && bigEyeBoy) {
    if (currentLetterCurrentCol === "A") {
      bigEyeBoyArr.push(updatedBigEyeRoadObj[currentLetterCurrentCol]);
    } else if (getLastArrayWithCol2Var[0] === bigEyeBoy[0]) {
      if (!Object.keys(bigEyeRoadObj).length) {
        bigEyeRoadObj[nextLetterToBreakColumn] = "R";
      } else {
        Object.keys(bigEyeRoadObj).forEach((key) => delete bigEyeRoadObj[key]);
        bigEyeRoadObj[nextLetterToBreakColumn] = "R";
      }
    } else {
      if (!Object.keys(bigEyeRoadObj).length) {
        bigEyeRoadObj[nextLetterToBreakColumn] = "B";
      } else {
        Object.keys(bigEyeRoadObj).forEach((key) => delete bigEyeRoadObj[key]);
        bigEyeRoadObj[nextLetterToBreakColumn] = "B";
      }

      if (!isEmpty(updatedBigEyeRoadObj)) {
        if (
          bigEyeRoadObj &&
          Object.keys(updatedBigEyeRoadObj)[0] === currentLetterCurrentCol
        ) {
          bigEyeBoyArr.push(updatedBigEyeRoadObj[currentLetterCurrentCol]);
        } else {
          const firstValue = letter(Object.values(updatedBigEyeRoadObj)[0]);
          bigEyeBoyArr.push(firstValue);
        }
      }
    }
  }

  if (getLastArrayWithCol2Var && smallRoad) {
    if (currentLetterCurrentCol === "A") {
      bigEyeBoyArr.push(updatedBigEyeRoadObj[currentLetterCurrentCol]);
    } else if (getLastArrayWithCol2Var[0] === smallRoad[0]) {
      if (!Object.keys(smallRoadObj).length) {
        smallRoadObj[nextLetterToBreakColumn] = "R";
      } else {
        Object.keys(smallRoadObj).forEach((key) => delete smallRoadObj[key]);
        smallRoadObj[nextLetterToBreakColumn] = "R";
      }
    } else {
      if (!Object.keys(smallRoadObj).length) {
        smallRoadObj[nextLetterToBreakColumn] = "B";
      } else {
        Object.keys(smallRoadObj).forEach((key) => delete smallRoadObj[key]);
        smallRoadObj[nextLetterToBreakColumn] = "B";
      }

      if (!isEmpty(updatedSmallRoadObj)) {
        if (
          smallRoadObj &&
          Object.keys(updatedSmallRoadObj)[0] === currentLetterCurrentCol
        ) {
          smallRoadArr.push(updatedSmallRoadObj[currentLetterCurrentCol]);
        } else {
          const firstValue = letter(Object.values(updatedSmallRoadObj)[0]);
          smallRoadArr.push(firstValue);
        }
      }
    }
  }

  if (getLastArrayWithCol2Var && cockroach) {
    if (currentLetterCurrentCol === "A") {
      bigEyeBoyArr.push(updatedBigEyeRoadObj[currentLetterCurrentCol]);
    } else if (getLastArrayWithCol2Var[0] === cockroach[0]) {
      if (!Object.keys(cockroachObj).length) {
        cockroachObj[nextLetterToBreakColumn] = "R";
      } else {
        Object.keys(cockroachObj).forEach((key) => delete cockroachObj[key]);
        cockroachObj[nextLetterToBreakColumn] = "R";
      }
    } else {
      if (!Object.keys(cockroachObj).length) {
        cockroachObj[nextLetterToBreakColumn] = "B";
      } else {
        Object.keys(cockroachObj).forEach((key) => delete cockroachObj[key]);
        cockroachObj[nextLetterToBreakColumn] = "B";
      }

      if (!isEmpty(updatedCockroachObj)) {
        if (
          cockroachObj &&
          Object.keys(updatedCockroachObj)[0] === currentLetterCurrentCol
        ) {
          cockroachArr.push(updatedCockroachObj[currentLetterCurrentCol]);
        } else {
          const firstValue = letter(Object.values(updatedCockroachObj)[0]);
          cockroachArr.push(firstValue);
        }
      }
    }
  }
}
