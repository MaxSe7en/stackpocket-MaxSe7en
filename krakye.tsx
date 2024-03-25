import { ChangeEvent, useEffect, useState } from "react";
import ControlBoard from "@/components/BetStatistics/RoadBet/ControlBoard";
import useRoadBetControlBoard from "@/components/BetStatistics/RoadBet/ControlBoardLayout";
import { calculatedUserPrize, isEmpty } from "@/functions/msc";
import { ROAD_BET_ACTION_TYPES } from "@/games/5d/stateActions";
import {
  AnalysisResults,
  BigBoyType,
  CockroachType,
  ColWidthType,
  Game,
  NextColorType,
  NumbersCategory,
  PercentageType,
  PlaceCheckBox,
  PlaceCheckBoxState,
  SmallRoadType,
  TreeType,
} from "@/interfaces/component";
import { MainStateProvider } from "@/StateContex";
import DerivedRoadColorsSection from "./HelperComponents/DerivedRoadColorsSection";
import DerivedRoads from "./HelperComponents/DerivedRoads";
import MainRoad from "./HelperComponents/MainRoad";
import styles from "./page.module.css";
import {
  listData,
  roadBetData,
  roadBetFormPlaceHolders,
  selectAllObjects,
  SND,
} from "@/utils/data/2sides";
import { useRouter } from "next/router";
import { LuLassoSelect } from "react-icons/lu";
import {
  check,
  countOccurrences,
  firstAndLast,
  gameSelectionsMapper,
  getBigSmallForBall,
  getBigSmallForSum,
  getDragonTiger,
  getLastArrayWithColWithoutA,
  getOddEven,
  getPrimeComposite,
  transpose,
} from "./roadBetHelperFunction";
import { fnSelector } from "@/utils/data/road";
import { fetcher } from "@/services/global/api";
import { roadbet_info_url } from "@/utils/Endpoints";

function RoadBet() {
  //   const [activeFormCheckBox,setActiveFormCheckBox] = useState([])
  const [activeFormCheckBox, setActiveFormCheckBox] = useState<string[]>([]);
  const [placeCheckBox, setPlaceCheckBox] = useState<{ [key: string]: any }>(
    {}
  );
  const [formCheckBox, setFormCheckBox] = useState<boolean>(true);
  // const card: string[] = ["1st", "2nd", "3rd", "4th", "5th", "sum"];

  const { lti: lottery_type_id, lt: lottery_id } = useRouter().query;

  const [data, setData] = useState<Record<string, TreeType>>(
    roadBetData[lottery_type_id.toString()]
  );
  const [percentage, setPercentage] = useState<Record<string, PercentageType>>(
    {}
  );
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
  const [isMount, setIsMount] = useState(false);
  const {
    roadBetSelections,
    roadBetDispatch,
    drawData,
    isInitialRender,
    setIsInitialRender,
    lotteryData,
    rebate,
    drawNumbers,
    // roadBetInfo,
    // setRoadBetInfo,
  }: any = MainStateProvider();
  const { multiplier, inputValues, setInputValues }: any =
    useRoadBetControlBoard();
  const checkColor = {
    R: "B",
    B: "R",
  };
  const [allSelect, setAllSelect] = useState(false);

  const [roadBetInfo, setRoadBetInfo] = useState<Game[]>([]);

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

  // useEffect(() => {
  //   if (isMount) {
  //     (async () => {
  //       try {
  //         const { data: roadBetInfo }: any = await fetcher(`${roadbet_info_url}?lottery_type_id=${lottery_type_id}`);
  //         // set state
  //         console.log(
  //           "roooooaddddddddddd info",
  //           roadBetInfo,
  //           lotteryData.lottery_id
  //         );
  //         setRoadBetInfo(roadBetInfo.data);
  //       } catch (error) {
  //         console.log("error", error);
  //       }
  //     })()
  //   }
  //   setIsMount(true);
  // }, [lottery_type_id])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: roadBetInfo }: any = await fetcher(`${roadbet_info_url}?lottery_type_id=${lottery_type_id}`);
        console.log("roooooaddddddddddd info", roadBetInfo, lotteryData.lottery_id);
        setRoadBetInfo(roadBetInfo);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [lottery_type_id]);
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
        .forEach((place) => {
          activeFormCheckBox.forEach((form) => {
            console.log(
              "form place",
              form,
              place,
              activeFormCheckBox,
              placeCheckBox
            );
            let trees: TreeType | undefined;
            let _percent: PercentageType | undefined;
            let _colWidth: ColWidthType | undefined;
            let _bigBoy: BigBoyType | undefined;
            let _cockroach: CockroachType | undefined;
            let _smallRoad: SmallRoadType | undefined;
            let _nextColor: NextColorType | undefined;
            // if (form === "Dragon/Tiger/Tie") {
            //   const dragonTigerTree = buildDragonTigerTree(
            //     drawNumbers,
            //     place,
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
            // console.log("form place", form, place, place !== "Sum", form == "Dragon/Tiger")
            if (place !== "Sum" && form === "Dragon/Tiger/Tie") return;
            if (place === "Sum" && form === "P/C") return;
            if (place === "Sum of Top Two" && form === "Dragon/Tiger") return;

            if (place === "Sum" && form === "P/C") return;
            if (place !== "Sum" && form === "Dragon/Tiger/Tie") return;
            if (place == "Sum") {
              if (["B/S Sum", "O/E Sum", "Sky/Ground", "First/Last", "Poultry/Beast", "Tail B/S"].includes(form)) {
                return;
              }
            }
            if (place === "Sum of Top Two" && form === "Dragon/Tiger") return;
            if (place === "Extra No." && form === "Big/Small(No Tie)") return;
            if (place === "Ball 1" && form === "Sky/Ground") {
              return;
            } else if (place === "Ball 2" && form === "Sky/Ground") {
              return
            }
            if (place === "Zodiac No.") {
              if (form === "Big/Small(No Tie)") return;
              if (form === "Poultry/Beast") return;
              if (form === "First/Last") return;
              if (form === "Sky/Ground") return;
              if (form === "Tail B/S") return;
              if (form === "Big/Small") return;
              if (form === "O/E Sum") return;
              if (form === "B/S Sum") return;
            }
            if (["Ball 1", "Ball 2", "Ball 3", "Ball 4", "Ball 5", "Ball 6"].includes(place)) {
              if (form === "Big/Small(No Tie)") return;
              if (form === "Poultry/Beast") return;
              if (form === "First/Last") return;
              if (form === "Sky/Ground") return;
            }

            if (place === "1st/2nd") {
              if (["Big/Small", "Odd/Even", "P/C", "B/S Sum"].includes(form)) return;
            }

            if (place === "1st/3rd") {
              if (["Big/Small", "Odd/Even", "P/C", "B/S Sum"].includes(form)) return;
            }

            if (place === "2nd/3rd") {
              if (["Big/Small", "Odd/Even", "P/C", "B/S Sum"].includes(form)) return;
            }

            if (place === "1st/2nd/3rd") {
              if (["Big/Small", "Odd/Even", "P/C"].includes(form)) return;
            }

            if (["1st", "2nd", "3rd"].includes(place)) {
              if (["B/S Sum", "O/E Sum", "B/S Tail Sum", "P/C Tail Sum"].includes(form)) return;
            }

            if (place === "Sum of Top Two") {
              if (form === "Dragon/Tiger") return;
            }

            if (place === "6th" || place === "7th" || place === "8th" || place === "9th" || place === "10th") {
              // console.log("came here")
              if (form === "Dragon/Tiger") return;
            }

            if (["1st", "2nd", "3rd", "4th", "5th"].includes(place) && lottery_type_id.toString() !== "2") {
              if (form === "Dragon/Tiger") return;
            }
            // console.log("form place after");
            const regularTree = buildTree(drawNumbers, place, form, lottery_type_id.toString());
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
              mainTree[form + "|" + place] = trees;
              percentage[form + "|" + place] = _percent;
              columnWidth[form + "|" + place] = _colWidth;
              bigBoy[form + "|" + place] = _bigBoy;
              cockroach[form + "|" + place] = _cockroach;
              smallRoad[form + "|" + place] = _smallRoad;
              nextColor[form + "|" + place] = _nextColor;
              console.log("mainTree", _bigBoy);
            }
          });
        });
    console.log("mainTree", Object.keys(mainTree), Object.keys(mainTree).length);
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
  }, [activeFormCheckBox, placeCheckBox, drawNumbers]);

  const formPlaceHolders: PlaceCheckBox =
    roadBetFormPlaceHolders[lottery_type_id.toString()];

  function selectPlaceCheckBox(y: string) {
    console.log("yyyyyyyyddddddddd", y);
    //  y is sum | 1st | 2nd | 3rd | 4th | 5th
    if (placeCheckBox.hasOwnProperty(y)) {
      const updatedPlaceCheckBox = { ...placeCheckBox };
      console.log("yyyyyyyyxx", updatedPlaceCheckBox);

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
        console.log("yyyyyyyyxxccccccccccccc", updatedPlaceCheckBox);
        return;
      }
      const updatedPlaceCheckBox = {
        ...placeCheckBox,
        [y]: { ...formPlaceHolders[y] },
      };
      setPlaceCheckBox(updatedPlaceCheckBox);
      setFormCheckBox(!formCheckBox);
      // console.log("yyyy",activeFormCheckBox)
    }
  }


  useEffect(() => {
    console.log("aaaaaactivePlaceCheckBox  ", roadBetInfo, activeFormCheckBox);
    console.log("aaaaaplaceCheckBox  ", placeCheckBox, Object.keys(placeCheckBox));
  }, [activeFormCheckBox, placeCheckBox]);

  function selectFormCheckBox(form: string) {
    console.log("formddddddd before", activeFormCheckBox);
    if (!activeFormCheckBox.includes(form)) {
      const updatedActiveFormCheckBox = [...activeFormCheckBox, form];
      setActiveFormCheckBox(updatedActiveFormCheckBox);
    } else {
      const updatedActiveFormCheckBox = activeFormCheckBox.filter(
        (activeForm) => activeForm !== form
      );
      Object.keys(placeCheckBox).forEach((place) => {
        if (place === "Sum" && form === "P/C") return;
        if (place !== "Sum" && form === "Dragon/Tiger/Tie") return;
        placeCheckBox[place][form] = {};
      });
      setActiveFormCheckBox(updatedActiveFormCheckBox);
    }
    console.log("formddddddd after", activeFormCheckBox);

  }



  /**
   * this function is Old but gold. because it works perfectly but just long
   * since its working on about 100 lottery games
   * @param numbersCategory 
   */
  function generateGridJSON(numbersCategory: NumbersCategory) {
    setPlaceCheckBox((prevPlaceCheckBox) => {
      // Create a copy of the previous state
      const updatedPlaceCheckBox: PlaceCheckBoxState = { ...prevPlaceCheckBox };
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxx", updatedPlaceCheckBox)

      Object.keys(updatedPlaceCheckBox).forEach((place) => {
        if (place === "Sum" && numbersCategory === "P/C") return;
        if (place !== "Sum" && numbersCategory === "Dragon/Tiger/Tie") return;
        if (place == "Sum") {
          if (["B/S Sum", "O/E Sum", "Sky/Ground", "First/Last", "Poultry/Beast", "Tail B/S"].includes(numbersCategory)) {
            return;
          }
        }
        if (place === "Sum of Top Two" && numbersCategory === "Dragon/Tiger") return;
        if (place === "Extra No." && numbersCategory === "Big/Small(No Tie)") return;
        if (place === "Ball 1" && numbersCategory === "Sky/Ground") {
          return;
        } else if (place === "Ball 2" && numbersCategory === "Sky/Ground") {
          return
        }
        if (place === "Zodiac No.") {
          if (numbersCategory === "Big/Small(No Tie)") return;
          if (numbersCategory === "Poultry/Beast") return;
          if (numbersCategory === "First/Last") return;
          if (numbersCategory === "Sky/Ground") return;
          if (numbersCategory === "Tail B/S") return;
          if (numbersCategory === "Big/Small") return;
          if (numbersCategory === "O/E Sum") return;
          if (numbersCategory === "B/S Sum") return;
        }
        if (["Ball 1", "Ball 2", "Ball 3", "Ball 4", "Ball 5", "Ball 6"].includes(place)) {
          if (numbersCategory === "Big/Small(No Tie)") return;
          if (numbersCategory === "Poultry/Beast") return;
          if (numbersCategory === "First/Last") return;
          if (numbersCategory === "Sky/Ground") return;
        }

        if (place === "1st/2nd") {
          if (["Big/Small", "Odd/Even", "P/C", "B/S Sum"].includes(numbersCategory)) return;
        }

        if (place === "1st/3rd") {
          if (["Big/Small", "Odd/Even", "P/C", "B/S Sum"].includes(numbersCategory)) return;
        }

        if (place === "2nd/3rd") {
          if (["Big/Small", "Odd/Even", "P/C", "B/S Sum"].includes(numbersCategory)) return;
        }

        if (place === "1st/2nd/3rd") {
          if (["Big/Small", "Odd/Even", "P/C"].includes(numbersCategory)) return;
        }

        if (["1st", "2nd", "3rd"].includes(place)) {
          if (["B/S Sum", "O/E Sum", "B/S Tail Sum", "P/C Tail Sum"].includes(numbersCategory)) return;
        }

        if (place === "Sum of Top Two") {
          if (numbersCategory === "Dragon/Tiger") return;
        }

        if (["1st", "2nd", "3rd", "4th", "5th"].includes(place) && lottery_type_id.toString() !== "2") {
          if (numbersCategory === "Dragon/Tiger") return;
        }

        console.log("place zzzz", place, numbersCategory);
        // Update the specific property within the nested object
        updatedPlaceCheckBox[place] = {
          ...updatedPlaceCheckBox[place],
          [numbersCategory]: numbersCategory,
        };
      });
      console.log("place zzzz", numbersCategory);
      return updatedPlaceCheckBox; // Return the updated state
    });
  }

  useEffect(() => {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxx", activeFormCheckBox)
    if (activeFormCheckBox.length > 0) {
      activeFormCheckBox.forEach((place) => {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxx place", place)
        generateGridJSON(place);
      });
    }
  }, [activeFormCheckBox, formCheckBox]);

  return (
    <div className={styles.container}>
      <div className={styles.overflow}>
        <div className={styles.ing}>
          <div className={styles.tre}>
            <div className={styles.flow}>
              <div className={styles.ccg}> Place</div>{" "}
              {
                listData?.[lottery_type_id.toString()].map(
                  (x: { place: any[] }) =>
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
                listData?.[lottery_type_id.toString()].map(
                  (x: { form: any[] }) =>
                    x.form.map((y, z) => (
                      <div key={z} className={styles.uio}>
                        <input
                          type="checkbox"
                          id={`form_checkbox${y}`}
                          onChange={() => selectFormCheckBox(y)}
                          checked={activeFormCheckBox.includes(y)}
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
              background: allSelect ? "#ED712E" : "",
              color: allSelect ? "#fff" : "",
            }}
            className={styles.all}
            onClick={() => {
              setPlaceCheckBox(selectAllObjects[lottery_type_id.toString()]);
              setActiveFormCheckBox(
                listData?.[lottery_type_id.toString()][0].form
              );
              // setActiveFormCheckBox([
              //   "Big/Small",
              //   "Odd/Even",
              //   "Dragon/Tiger/Tie",
              //   "P/C",
              // ]);
              console.log("yyyyy", activeFormCheckBox);
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
              setActiveFormCheckBox([]);
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
              console.log("lastCell", ["B", "O", "D", "P", "F"]);
              setRoadForms(["B", "O", "D", "P", "F", "S"]);
              setRoadFormsColor("R");
              toggleBlinking();
            }}
          >
            B,O,D,P
          </button>
          <button
            className={styles.borp2}
            onClick={() => {
              console.log("lastCell", ["S", "E", "T", "C", "L"]);
              setRoadForms(["S", "E", "T", "C", "L", "G", "B"]);
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
            // console.log("placeCheckBoxObjValues", _key, placeCheckBoxObjValues, placeCheckBoxObjValues[2], ["6th", "7th", "8th", "9th", "10th"].includes(_key), placeCheckBoxObjValues?.[2] === "Dragon/Tiger");
            // console.log("placeCheckBoxObjValues", placeCheckBoxObjValues[2], ["6th", "7th", "8th", "9th", "10th"].includes(_key), placeCheckBoxObjValues?.[2] === "Dragon/Tiger");
            // if (placeCheckBoxObjValues?.[2] === "Dragon/Tiger" && ["6th", "7th", "8th", "9th", "10th"].includes(_key)) { return }//to handle pk10 games 
            if (placeCheckBoxObjValues.length > 0) {
              return (
                <div key={index}>
                  {/* {JSON.stringify(placeCheckBoxObjValues)} {JSON.stringify(_key)} */}
                  {placeCheckBoxObjValues.map((_form: string, i: number) => {
                    if (lottery_type_id.toString() == "6" && _form === "Dragon/Tiger" && ["1st", "2nd", "3rd", "4th", "5th"].includes(_key)) { return null }
                    // if (lottery_type_id.toString() == "2" && _form === "Dragon/Tiger" && ["6th", "7th", "8th", "9th", "10th"].includes(_key)) { return }
                    return (
                      <div className={styles.contain} key={i}>
                        <div className={styles.dashes}>
                          <div className={styles.head}>
                            <div className={styles.nv}>
                              <span className={styles.places}>{_key}</span> -{" "}
                              <span className={styles.form}>{_form}</span>
                            </div>
                            <div className={styles.nv}>
                              {!isEmpty(percentage?.[_form + "|" + _key]) &&
                                Object.keys(percentage?.[_form + "|" + _key]).map(
                                  (key, index) => (
                                    <span
                                      className={`${styles.drt} form`}
                                      style={{
                                        color: ["B", "O", "P", "D", "F", "Y", "M"].includes(
                                          key
                                        )
                                          ? "red"
                                          : "blue",
                                      }}
                                      key={index}
                                    >
                                      {`${key}: ${percentage?.[_form + "|" + _key][key]}`}
                                    </span>
                                  )
                                )}
                            </div>
                            <div className={`${styles.nv} ${styles.derivedRoad}`}>
                              {!isEmpty(percentage?.[_form + "|" + _key]) &&
                                Object.keys(
                                  percentage?.[_form + "|" + _key]
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
                              {roadBetInfo?.map((roadBetInfo: { gn_id: any; group_type: any; odds: any; name: any; }, index: any) => {
                                const { gn_id, group_type, odds, name } = roadBetInfo;
                                const { sub_game }: any = roadBetInfo;
                                const gamesWithSubGames = [14, 1116, 1117, 1182];
                                const gameSelectOptions = group_type.split("/");
                                const selectionOne = gameSelectionsMapper(gameSelectOptions[0], lottery_type_id.toString(), gn_id);
                                const selectionTwo = gameSelectionsMapper(gameSelectOptions[1], lottery_type_id.toString());
                                return (
                                  <div key={gn_id}>
                                    {name === _key && group_type === _form && (
                                      <div
                                        // style={{
                                        //   display:
                                        //     gn_id === 14 ? "grid" : "",
                                        //   gridTemplateColumns:
                                        //     gn_id === 14 ? "1fr" : "",
                                        // }}
                                        className={styles.inbox_match}
                                      >
                                        {/* {JSON.stringify(_key)} {JSON.stringify(group_type)} */}
                                        <div
                                          className={`${styles.jgddwqs} ${roadBetSelections?.[_key]?.[group_type]?.[
                                            gn_id
                                          ]?.hasOwnProperty(selectionOne) &&
                                            styles.selected
                                            }`}
                                          onClick={() => {
                                            inputValues[
                                              `${name}-${selectionOne}`
                                            ] = roadBetSelections?.[_key]?.[group_type]?.[
                                              gn_id
                                            ]?.hasOwnProperty(selectionOne)
                                                ? ""
                                                : multiplier;
                                            setInputValues(inputValues);

                                            const amount = roadBetSelections?.[
                                              _key
                                            ]?.[group_type]?.[gn_id]?.hasOwnProperty(
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
                                                rowId: group_type
                                              },
                                            });
                                          }}
                                        >
                                          <div
                                            id={styles.nn}
                                            className={styles.nnn}
                                          >
                                            {selectionOne} {" "} {gn_id}
                                          </div>
                                          <div
                                            id={styles.nn}
                                            className={styles.nnn}
                                          >
                                            {gamesWithSubGames.includes(gn_id)
                                              ? calculatedUserPrize(
                                                sub_game[0].odds,
                                                1,
                                                rebate
                                              )
                                              : calculatedUserPrize(
                                                odds,
                                                1,
                                                rebate
                                              )}
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
                                                      rowId: group_type
                                                    },
                                                  });
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div
                                          className={`${styles.jgddwqs} ${roadBetSelections?.[_key]?.[group_type]?.[
                                            gn_id
                                          ]?.hasOwnProperty(selectionTwo) &&
                                            styles.selected
                                            }`}
                                          style={{ background: "ed" }}
                                          onClick={() => {
                                            inputValues[
                                              `${name}-${selectionTwo}`
                                            ] = roadBetSelections?.[_key]?.[group_type]?.[
                                              gn_id
                                            ]?.hasOwnProperty(selectionTwo)
                                                ? ""
                                                : multiplier;
                                            setInputValues(inputValues);

                                            const amount = roadBetSelections?.[
                                              _key
                                            ]?.[group_type]?.[gn_id]?.hasOwnProperty(
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
                                                rowId: group_type
                                              },
                                            });
                                          }}
                                        >
                                          <div
                                            id={styles.nn}
                                            className={styles.nnn}
                                          >
                                            {selectionTwo}
                                          </div>
                                          <div
                                            id={styles.nn}
                                            className={styles.nnn}
                                          >
                                            {gamesWithSubGames.includes(gn_id)
                                              ? calculatedUserPrize(
                                                sub_game[1].odds,
                                                1,
                                                rebate
                                              )
                                              : calculatedUserPrize(
                                                odds,
                                                1,
                                                rebate
                                              )}
                                          </div>
                                          <div className={styles.shiftdown}>
                                            {/* 
                                            {/* 
                                              {/* 
                                                  <span id={styles.oo} className={styles.nnn}>
                                                    {odds} 
                                                  {odds} 
                                                    {odds} 
                                                  </span> 
                                                </span> 
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
                                                      rowId: group_type
                                                    },
                                                  });
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        {group_type === "Dragon/Tiger/Tie" && (
                                          <div
                                            className={`${styles.jgddwqs} ${roadBetSelections?.[_key]?.[group_type]?.[
                                              gn_id
                                            ]?.hasOwnProperty(
                                              sub_game[2]?.label
                                            ) && styles.selected
                                              }`}
                                            // style={{ background: "ed" }}
                                            onClick={() => {
                                              inputValues[
                                                `${name}-${sub_game[2]?.label}`
                                              ] = roadBetSelections?.[_key]?.[group_type]?.[
                                                gn_id
                                              ]?.hasOwnProperty(
                                                sub_game[2]?.label
                                              )
                                                  ? ""
                                                  : multiplier;
                                              setInputValues(inputValues);

                                              const amount =
                                                roadBetSelections?.[_key]?.[group_type]?.[
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
                                                  rowId: group_type
                                                },
                                              });
                                            }}
                                          >
                                            <div
                                              id={styles.nn}
                                              className={styles.nnn}
                                            >
                                              {sub_game[2]?.label}
                                            </div>
                                            <div
                                              id={styles.nn}
                                              className={styles.nnn}
                                            >
                                              {calculatedUserPrize(
                                                sub_game[2]?.odds,
                                                1,
                                                rebate
                                              )}
                                            </div>
                                            <div className={styles.shiftdown}>
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
                                                        [`${name}-${sub_game[2]?.label}`]:
                                                          acceptedAmt,
                                                      })
                                                    );
                                                    roadBetDispatch({
                                                      type: ROAD_BET_ACTION_TYPES.ADD_ROAD,
                                                      payload: {
                                                        userSelection:
                                                          sub_game[2]?.label,
                                                        game_name: _key,
                                                        amount: acceptedAmt,
                                                        game_id: gn_id,
                                                        rowId: group_type
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



/**
 * Build a tree structure from draw numbers and analyze the results for a given form.
 *
 * @param drawNumbers - The array of draw numbers to analyze.
 * @param place - The aspect of the draw numbers to analyze (e.g., "Sum").
 * @param form - The form of analysis (e.g., "Big/Small").
 * @returns An object containing the tree structure, percentage, column width, derived roads, and color information.
 */

export function buildTree(
  drawNumbers: number[][],
  place: string,
  form: string,
  lottery_id: string
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
  const analyzedDrawNumbersResults = transpose(
    fnSelector(drawNumbers, place, form, lottery_id)[form]
  ); // analyzeDrawNumbers(drawNumbers, place)[form];//fnSelector(drawNumbers, place, form, lottery_id)[form]
  console.log(
    "analyzedResults-------------------??????",
    analyzedDrawNumbersResults
  );
  let percentage = countOccurrences(analyzedDrawNumbersResults["newArr"], form);

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
  let currentHighestColumn = 0; //to help enforce that all plots are visible in the chart
  // analyzedDrawNumbersResults.forEach((currentLetter: any, i: number) => {
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

  const img = analyzedDrawNumbersResults;
  console.log("img----------------->", img);
  img["newArr"].forEach((_value, i) => {
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
        form === "Dragon/Tiger/Tie" &&
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

      if (prev === currentLetter && form !== "Dragon/Tiger/Tie") {
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

    if (col > currentHighestColumn) {
      currentHighestColumn = col;
    }

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
  console.log("colwidth: ccccc", col, tree);
  return {
    tree,
    percentage,
    colWidth: currentHighestColumn,
    bigBoy,
    smallRoad,
    cockroach,
    nextColor: { bigEyeRoadObj, smallRoadObj, cockroachObj },
  };
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


  /**
     * @NB This function is used to skip certain categories based on the place
     * to get a clear understanding would depend on which lottery under roadbet
     * you are working on.
     * @description when you are on 5D lottery the road does not show for 
     * form of "P/C" and place "Sum" so this function snippet just works in a way to prevent
     * that.
     * Similar scenario or rule is true for all other lotteries
     * @param place eg. "Sum" | "1st" | "2nd" | "3rd" | "4th" | "5th"
     * @param category eg. "Big/Small" | "Odd/Even" | "P/C" | "Dragon/Tiger/Tie" | "Big/Small(No Tie)" | "Odd/Even(No Tie)" | "P/C(No Tie)" | "Dragon/Tiger"
     * @returns boolean
     */
  // function shouldSkipCategory(place: string, category: string): boolean {
  //   if (place === "Sum" && category === "P/C") return true;
  //   if (place !== "Sum" && category === "Dragon/Tiger/Tie") return true;
  //   if (place === "Sum") {
  //     if (["B/S Sum", "O/E Sum", "Sky/Ground", "First/Last", "Poultry/Beast", "Tail B/S"].includes(category)) {
  //       return true;
  //     }
  //   }
  //   if (place === "Sum of Top Two" && category === "Dragon/Tiger") return true;
  //   if (place === "Extra No." && category === "Big/Small(No Tie)") return true;
  //   if (place === "Ball 1" && category === "Sky/Ground") return true;
  //   if (place === "Ball 2" && category === "Sky/Ground") return true;
  //   if (place === "Zodiac No.") {
  //     if (["Big/Small(No Tie)", "Poultry/Beast", "First/Last", "Sky/Ground", "Tail B/S", "Big/Small", "O/E Sum", "B/S Sum"].includes(category)) {
  //       return true;
  //     }
  //   }
  //   if (["Ball 1", "Ball 2", "Ball 3", "Ball 4", "Ball 5", "Ball 6"].includes(place)) {
  //     if (["Big/Small(No Tie)", "Poultry/Beast", "First/Last", "Sky/Ground"].includes(category)) {
  //       return true;
  //     }
  //   }
  //   if (place === "1st/2nd") {
  //     if (["Big/Small", "Odd/Even", "P/C", "B/S Sum"].includes(category)) return true;
  //   }
  //   if (place === "1st/3rd") {
  //     if (["Big/Small", "Odd/Even", "P/C", "B/S Sum"].includes(category)) return true;
  //   }
  //   if (place === "2nd/3rd") {
  //     if (["Big/Small", "Odd/Even", "P/C", "B/S Sum"].includes(category)) return true;
  //   }
  //   if (place === "1st/2nd/3rd") {
  //     if (["Big/Small", "Odd/Even", "P/C"].includes(category)) return true;
  //   }
  //   if (["1st", "2nd", "3rd"].includes(place)) {
  //     if (["B/S Sum", "O/E Sum", "B/S Tail Sum", "P/C Tail Sum"].includes(category)) return true;
  //   }
  //   if (place === "Sum of Top Two") {
  //     if (category === "Dragon/Tiger") return true;
  //   }
  //   if (["1st", "2nd", "3rd", "4th", "5th"].includes(place) && lottery_type_id.toString() !== "2") {
  //     if (category === "Dragon/Tiger") return true;
  //   }
  //   return false;
  // }

  // function shouldSkipPlace(place: string, category: string): boolean {
  //   if (place === "Ball 1" && category === "Sky/Ground") return true;
  //   if (place === "Ball 2" && category === "Sky/Ground") return true;
  //   return false;
  // }

  // function generateGridJSONiiiii(numbersCategory: NumbersCategory) {
  //   const updatedPlaceCheckBox: PlaceCheckBoxState = { ...placeCheckBox };



  //   function updatePlace(place: string, category: string) {

  //     updatedPlaceCheckBox[place] = {
  //       ...updatedPlaceCheckBox[place],
  //       [category]: category,
  //     };
  //   }

  //   Object.keys(updatedPlaceCheckBox).forEach((place) => {
  //     if (shouldSkipCategory(place, numbersCategory) || shouldSkipPlace(place, numbersCategory)) {
  //       return;
  //     }

  //     if (place === "1st/2nd" || place === "1st/3rd" || place === "2nd/3rd" || place === "1st/2nd/3rd") {
  //       if (["Big/Small", "Odd/Even", "P/C", "B/S Sum"].includes(numbersCategory)) return;
  //     }

  //     if (["1st", "2nd", "3rd"].includes(place)) {
  //       if (["B/S Sum", "O/E Sum", "B/S Tail Sum", "P/C Tail Sum"].includes(numbersCategory)) return;
  //     }

  //     if (place === "Sum of Top Two" && numbersCategory === "Dragon/Tiger") return;
  //     if (["1st", "2nd", "3rd", "4th", "5th"].includes(place) && lottery_type_id.toString() !== "2" && numbersCategory === "Dragon/Tiger") return;

  //     console.log("place zzzz", place, numbersCategory);
  //     updatePlace(place, numbersCategory);
  //   });

  //   console.log("place zzzz", numbersCategory);
  //   setPlaceCheckBox(updatedPlaceCheckBox);
  // }