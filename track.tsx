import {
  createTrackJson,
  createTrackYield,
  generateSelectOptions,
  sumBetAmtAndBets,
} from "@/functions/cartTruck";
import {
  fixArithmetic,
  getDate,
  getTime,
  truncateEllipsis,
} from "@/functions/msc";
import { GameData, TrackState } from "@/interfaces/reducer";
import { getTrackData, getTrackYieldData } from "@/services/betnow";
import React, { CSSProperties, memo, useEffect, useState } from "react";
import styles from "../../styles/Track.module.css";
import { mainStateProvider } from "@/StateContex";
import { ACTION_TYPES } from "@/games/5d/stateActions";

interface trackC {
  bet: GameData;
  trackState: TrackState;
  cartDispatch: any;
  cartState?: any;
  trackData: any;
  trackYieldData: any;
  setTrackYieldData: any;
  setTrackData: any;
  trackCart: any;
  trackBet: any;
  trackType: string;
  onClose: () => void;
  SetResponse: any;
}

//
function Track({
  onClose,
  cartState,
  bet,
  trackState,
  cartDispatch,
  trackData,
  trackYieldData,
  setTrackYieldData,
  setTrackData,
  trackCart,
  trackBet,
  trackType,
  SetResponse,
}: trackC) {
  const [tab, setTab] = useState<any>(1);
  const [defaultTrackDraws, setDefaultTrackDraws] = useState<any>(10);
  const [firstMultiplier, setFirstMultiplier] = useState<string>("1");
  const [multiplyAfterEvery, setMultiplyAfterEvery] = useState<string>("1");
  const [multiplyBy, setMultiplyBy] = useState<string>("1");
  const [selectedIndexx, setSelectedIndexx] = useState<number>(0);
  const [stopIfWin, setStopIfWin] = useState<number>(0);
  const [stopIfNotWin, setStopIfNotWin] = useState<number>(0);
  const [firstYieldMultiplier, setFirstYieldMultiplier] = useState<number>(1);
  const [minimumYield, setMinimumYield] = useState<number>(50);
  const [trackYieldDraw, setTrackYieldDraw] = useState<any>(10);

  const { drawData, balance, setBallance, userPrize } = mainStateProvider();

  const [selectFirstDraw, setSelectFirstDraw] = useState(
    generateSelectOptions(drawData.betId, drawData.drawDateTime)[0].currentBetId
  );

  function handleRadioChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.id === "stop_if_win") {
      setStopIfWin(1);
      setStopIfNotWin(0);
    } else if (event.target.id === "stop_if_not_win") {
      setStopIfWin(0);
      setStopIfNotWin(1);
    }
  }

  //track data
  useEffect(() => {
    console.log("trackData", trackData);
    setTrackData(
      createTrackJson(
        drawData.drawDateTime,
        drawData.nextBetId,
        defaultTrackDraws,
        +firstMultiplier,
        +multiplyAfterEvery,
        +multiplyBy,
        trackType === "trackBet"
          ? bet.totalBetAmt
          : sumBetAmtAndBets(cartState["items"])[0],
        trackType === "trackBet"
          ? bet.totalBets
          : sumBetAmtAndBets(cartState["items"])[1],
        drawData.nextBetId
      )
    );
  }, [
    defaultTrackDraws,
    firstMultiplier,
    multiplyAfterEvery,
    multiplyBy,
    bet.totalBetAmt,
  ]);

  // // track Yield data
  useEffect(() => {
    console.log("trackYieldData", trackYieldData);
    setTrackYieldData(
      createTrackYield(
        drawData.drawDateTime,
        drawData.nextBetId,
        trackYieldDraw,
        trackType === "trackBet"
          ? bet.totalBetAmt
          : sumBetAmtAndBets(cartState["items"])[1],
        firstYieldMultiplier,
        trackType === "trackBet"
          ? bet.totalBetAmt
          : sumBetAmtAndBets(cartState["items"])[0],
        userPrize, //should be taken from api
        drawData.nextBetId,
        minimumYield
      )
    );
  }, [firstYieldMultiplier, minimumYield, trackYieldDraw]);

  const handleTrackDrawChange = (event: any) => {
    let inputValue = event.target.value;
    let limit = 120 - selectedIndexx;

    if (inputValue < 1) {
      setDefaultTrackDraws("");
    } else if (inputValue > 120) {
      setDefaultTrackDraws(120);
    } else if (inputValue > limit) {
      setDefaultTrackDraws(limit);
    } else {
      setDefaultTrackDraws(inputValue);
    }
    console.log(trackData);
  };

  function handleTrackYieldDrawChange(e: any) {
    let inputValue = e.target.value;
    setTrackYieldDraw(inputValue);

    if (inputValue < 1) {
      setTrackYieldDraw("");
    } else if (inputValue > 120) {
      setTrackYieldDraw(120);
    } else {
      setTrackYieldDraw(inputValue);
    }
  }

  function changeFirstDraw(e: any) {
    const selectedIndex = e.target.selectedIndex;
    const selectedOption = e.target.options[selectedIndex];
    const dateToStart = selectedOption.getAttribute("data-date-to-start");
    setSelectedIndexx(selectedIndex);

    setSelectFirstDraw(e.target.value);

    let totalSelectionsLeft = 120 - selectedIndex;
    defaultTrackDraws > totalSelectionsLeft &&
      setDefaultTrackDraws(totalSelectionsLeft);

    setTrackData(
      createTrackJson(
        dateToStart,
        e.target.value,
        defaultTrackDraws,
        +firstMultiplier,
        +multiplyAfterEvery,
        +multiplyBy,
        trackType === "trackBet"
          ? bet.totalBetAmt
          : sumBetAmtAndBets(cartState["items"])[0],
        trackType === "trackBet"
          ? bet.totalBets
          : sumBetAmtAndBets(cartState["items"])[1],
        drawData.nextBetId
      )
    );
  }

  const [show, setShow] = useState(true);
  const [view, setView] = useState(false);

  useEffect(() => {
    if (view) {
      setShow(false);
      setTimeout(() => {
        console.log("cartState", cartState);
        setTrackData(
          createTrackJson(
            drawData.drawDateTime,
            drawData.nextBetId,
            defaultTrackDraws,
            +firstMultiplier,
            +multiplyAfterEvery,
            +multiplyBy,
            trackType === "trackBet"
              ? bet.totalBetAmt
              : sumBetAmtAndBets(cartState["items"])[0],
            trackType === "trackBet"
              ? bet.totalBets
              : sumBetAmtAndBets(cartState["items"])[1],
            drawData.nextBetId
          )
        );

        setTrackYieldData(
          createTrackYield(
            drawData.drawDateTime,
            drawData.nextBetId,
            trackYieldDraw,
            trackType === "trackBet"
              ? bet.totalBetAmt
              : sumBetAmtAndBets(cartState["items"])[1],
            firstYieldMultiplier,
            trackType === "trackBet"
              ? bet.totalBetAmt
              : sumBetAmtAndBets(cartState["items"])[0],
            userPrize, //should be taken from api
            drawData.nextBetId,
            minimumYield
          )
        );

        setSelectFirstDraw(
          generateSelectOptions(drawData.betId, drawData.drawDateTime)[0]
            .currentBetId
        );

        setShow(true);
      }, 3000);
    }

    setView(true);
  }, [drawData]);

  return (
    <div style={{ padding: 0 }}>
      <div className={styles.closex}>
        <button className={styles.close} onClick={onClose}>
          Close
        </button>
      </div>
      <div style={{ padding: 0 }} className={styles.tableFixHead}>
        <table style={tableStyle as CSSProperties}>
          <thead>
            <tr>
              <th style={thStyle as CSSProperties}>No</th>
              <th style={thStyle as CSSProperties}>Type</th>
              <th style={thStyle as CSSProperties}>Detail</th>
              <th style={thStyle as CSSProperties}>Bets</th>
              <th style={thStyle as CSSProperties}>Unit</th>
              <th style={thStyle as CSSProperties}>Bet Amt. ()</th>
            </tr>
          </thead>
          <tbody>
            {trackState.map(
              (
                {
                  gameType,
                  userSelections,
                  totalBets,
                  unitStaked,
                  totalBetAmt,
                }: GameData,
                index: number
              ) => (
                <tr key={index}>
                  <td style={tdStyle as CSSProperties}>{index + 1}</td>
                  <td style={tdStyle as CSSProperties}>{gameType}</td>
                  <td style={tdStyle as CSSProperties}>
                    {userSelections && truncateEllipsis(userSelections)}
                  </td>
                  <td style={tdStyle as CSSProperties}>{totalBets}</td>
                  <td style={tdStyle as CSSProperties}>{unitStaked}</td>
                  <td style={tdStyle as CSSProperties}>
                    {fixArithmetic(totalBetAmt)}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <div className={styles.flowselect}>
        <button
          style={{ background: tab === 1 ? "black" : "" }}
          className={styles.tab}
          onClick={() => setTab(1)}
        >
          Track Number
        </button>{" "}
        <button
          style={{ background: tab === 2 ? "black" : "" }}
          className={styles.tab}
          onClick={() => setTab(2)}
        >
          Profit margin chasing margin
        </button>
      </div>
      {tab === 1 ? (
        <div className={styles.booi}>
          {/* <h3>{selectedIndexx}</h3> */}
          <div className={styles.flow}>
            <div className={styles.flowin}>
              <div style={{ margin: 5 }}>First draw:</div>
              <select
                className={styles.inp}
                onChange={(e) => changeFirstDraw(e)}
              >
                {generateSelectOptions(
                  drawData.betId,
                  drawData.drawDateTime
                ).map(({ currentBetId, idDateTime }, index) => (
                  <option
                    data-date-to-start={
                      getDate(idDateTime) + " " + getTime(idDateTime)
                    }
                    value={currentBetId}
                    key={getDate(idDateTime) + " " + getTime(idDateTime)}
                  >
                    {currentBetId} {index === 0 ? "Current" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.flowin}>
              <div style={{ margin: 5 }}>Track draw</div>
              <input
                className={styles.inp}
                type="number"
                value={defaultTrackDraws}
                onChange={(event) => handleTrackDrawChange(event)}
                max={120 - selectedIndexx}
                min={1}
                onKeyDown={(event) =>
                  event.key === "-" && event.preventDefault()
                }
              />
              <div style={{ margin: 5 }}>draws (Maximum track 120 draws)</div>
            </div>
          </div>

          <div className={styles.flow}>
            <div className={styles.flowin}>
              <div style={{ margin: 5 }}>First Mult</div>
              <input
                className={styles.inp}
                type="number"
                onChange={(event) => setFirstMultiplier(event.target.value)}
                value={firstMultiplier}
                min={1}
                onKeyDown={(event) =>
                  event.key === "-" && event.preventDefault()
                }
              />
            </div>
            <div className={styles.flowin}>
              <div style={{ margin: 5 }}>Every</div>
              <input
                className={styles.inp}
                type="number"
                onChange={(event) => setMultiplyAfterEvery(event.target.value)}
                value={multiplyAfterEvery}
                min={1}
                onKeyDown={(event) =>
                  event.key === "-" && event.preventDefault()
                }
              />{" "}
              <div style={{ margin: 5 }}>draws(s)</div>
            </div>
            <div className={styles.flowin}>
              <div style={{ margin: 5 }}>Mult.x</div>
              <input
                className={styles.inp}
                type="number"
                onChange={(event) => setMultiplyBy(event.target.value)}
                value={multiplyBy}
                min={1}
                onKeyDown={(event) =>
                  event.key === "-" && event.preventDefault()
                }
              />
            </div>
          </div>

          <div>
            <div className={styles.tableFixHead}>
              <table style={tableStyle as CSSProperties}>
                <thead className={styles.hed}>
                  <tr>
                    <th style={thStyle as CSSProperties}>Track No.</th>
                    <th style={thStyle as CSSProperties}>Track ID.</th>
                    <th style={thStyle as CSSProperties}>Multi</th>
                    <th style={thStyle as CSSProperties}>Bet Amount</th>
                    <th style={thStyle as CSSProperties}>Estimate draw time</th>
                  </tr>
                </thead>

                {/* 2nd table  */}
                <tbody>
                  {trackData.bets.map(
                    (
                      {
                        betAmt,
                        betId,
                        current,
                        estimatedDrawTime,
                        multiplier,
                        nextDay,
                        trackNo,
                        checkBox,
                      }: any,
                      index: number
                    ) => (
                      <tr
                        key={index}
                        data-value={betId}
                        className="track-entry"
                      >
                        <td style={tdStyle as CSSProperties}>{trackNo}</td>
                        <td style={tdStyle as CSSProperties}>
                          {/* <input
                            type="checkbox"
                            name=""
                            id=""
                            value={checkBox}
                            checked={checkBox}
                            className={styles.inp}
                            onChange={(prev) => {
                              const updatedTrackData = { ...trackData };
                              updatedTrackData.bets[index].checkBox =
                                prev.target.checked;
                              setTrackData(updatedTrackData);
                            }}
                          /> */}
                          {betId}{" "}
                          {show && current && (
                            <button className={styles.current}>Current</button>
                          )}{" "}
                          {nextDay && <button>Next Day</button>}{" "}
                          {index === 1 && !show && (
                            <button className={styles.current}>Current</button>
                          )}
                        </td>
                        <td style={tdStyle as CSSProperties}>
                          <input
                            value={multiplier}
                            type="number"
                            className={styles.inp}
                            onInput={(e:any) => {
                              const inputValue = Math.abs(
                                parseInt(e.target.value)
                              ); // Get the absolute value of the parsed input
                              if (inputValue > 0) {
                                e.target.value = inputValue; // Set the input value to the valid positive number
                              } else {
                                e.target.value = ""; // Clear the input value if 0 or negative number is entered
                              }
                            }}
                            onChange={(e) => {
                              const updatedTrackData = { ...trackData };

                              updatedTrackData.bets[index].multiplier =
                                e.target.value;

                              updatedTrackData.trackInfo.totalBetAmt =
                                updatedTrackData.bets.reduce(
                                  (
                                    acc: number,
                                    trackInfo: {
                                      betAmt: number;
                                      multiplier: number;
                                    }
                                  ) =>
                                    acc +
                                    trackInfo.betAmt * trackInfo.multiplier,
                                  0
                                );

                              setTrackData(updatedTrackData);
                              if (+e.target.value === 0) {
                                setTimeout(() => {
                                  updatedTrackData.bets[index].multiplier = 1;
                                  setTrackData(updatedTrackData);
                                }, 100);
                              }
                            }}
                            min={1}
                            onKeyDown={(event) =>
                              event.key === "-" && event.preventDefault()
                            }
                          />
                        </td>
                        <td style={tdStyle as CSSProperties}>
                          {fixArithmetic(betAmt * multiplier)}
                        </td>
                        <td style={tdStyle as CSSProperties}>
                          {estimatedDrawTime}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.goo}>
              <div className={styles.footertab}>
                <div className={styles.tr}>
                  <span>
                    Total track{" "}
                    <strong>{trackData.trackInfo.totalDraws} </strong>
                    draw(s)
                  </span>
                </div>
                <div className={styles.tr}>
                  <span style={{ marginLeft: 20 }}>
                    Total.
                    <strong>
                      {trackData.trackInfo.totalDraws *
                        trackData.trackInfo.eachTotalBets}{" "}
                    </strong>
                    bet(s)
                  </span>
                </div>
                <div className={styles.tr}>
                  <span>
                    Total Amt.
                    <strong>
                      {fixArithmetic(trackData.trackInfo.totalBetAmt)}
                    </strong>
                  </span>
                </div>
                <div className={styles.tr}>
                  <span>
                    Balance:
                    <strong>{balance}</strong>
                  </span>
                </div>
              </div>
              <div className={styles.flowinx}>
                <div className={styles.flowcontain}>
                  <div>
                    <input
                      type="radio"
                      name="stop_if_win"
                      id="stop_if_win"
                      checked={stopIfWin === 1}
                      onChange={handleRadioChange}
                      className={styles.inp}
                    />
                    <label htmlFor="stop_if_win">Stop if win</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="stop_if_win"
                      id="stop_if_not_win"
                      checked={stopIfNotWin === 1}
                      onChange={handleRadioChange}
                      className={styles.inp}
                    />
                    <label htmlFor="stop_if_not_win">Stop if not win</label>
                  </div>
                </div>

                <button
                  className={styles.trackbtn}
                  onClick={() => {
                    getTrackData(
                      { ...trackData },
                      { ...trackState },
                      stopIfWin,
                      stopIfNotWin,
                      SetResponse,
                      cartDispatch,
                      setBallance
                    );
                  }}
                >
                  track
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.faro}>
            <div className={styles.goin}>
              <label className={styles.padd}>First Multi:</label>
              <span>
                <input
                  className={styles.inp}
                  type="number"
                  min="1"
                  value={firstYieldMultiplier}
                  onChange={(e) => setFirstYieldMultiplier(+e.target.value)}
                />
              </span>
            </div>

            <div className={styles.goin}>
              <label className={styles.padd}>Minimum yield:</label>
              <span>
                <input
                  className={styles.inp}
                  type="number"
                  min={1}
                  value={minimumYield}
                  onChange={(e) => setMinimumYield(+e.target.value)}
                />
                <span>%</span>
              </span>
            </div>

            <div className={styles.goin}>
              <span>
                <label className={styles.padd}>Track draw:</label>
                <span>
                  <input
                    className={styles.inp}
                    type="number"
                    value={trackYieldDraw}
                    max={120 - selectedIndexx}
                    min={1}
                    onKeyDown={(event) =>
                      event.key === "-" && event.preventDefault()
                    }
                    onChange={(e) => handleTrackYieldDrawChange(e)}
                  />
                </span>
                <label>draws (Maximum track 120 draws)</label>
              </span>
            </div>
          </div>

          <div>
            <table style={tableStyle as CSSProperties}>
              <thead>
                <tr>
                  <th style={thStyle as CSSProperties}>Track ID.</th>
                  <th style={thStyle as CSSProperties}>Multi</th>
                  <th style={thStyle as CSSProperties}>Bet Amount</th>
                  <th style={thStyle as CSSProperties}>Bonus</th>
                  <th style={thStyle as CSSProperties}>
                    Current Betting Amount
                  </th>
                  {/* Expected profit amount	Expected Profitability (%)	Estimate draw time */}
                  <th style={thStyle as CSSProperties}>
                    Expected profit amount
                  </th>
                  <th style={thStyle as CSSProperties}>
                    Expected Profitability (%)
                  </th>
                  <th style={thStyle as CSSProperties}>Estimate draw time</th>
                </tr>
              </thead>

              {/* 2nd table  */}
              <tbody>
                {trackYieldData.bets.map(
                  (
                    {
                      betAmt,
                      betId,
                      bonus,
                      current,
                      currentAmt,
                      estimatedDrawTime,
                      expectedProfit,
                      multiplier,
                      nextDay,
                      percentageProfit,
                    }: any,
                    index: number
                  ) => (
                    <tr key={index}>
                      <td style={tdStyle as CSSProperties}>
                        {betId}{" "}
                        {show && current && (
                          <button className={styles.current}>Current</button>
                        )}{" "}
                        {nextDay && <button>Next Day</button>}{" "}
                        {index === 1 && !show && (
                          <button className={styles.current}>Current</button>
                        )}
                      </td>
                      <td style={tdStyle as CSSProperties}>{multiplier}</td>
                      <td style={tdStyle as CSSProperties}>
                        {betAmt.toLocaleString()}
                      </td>
                      <td style={tdStyle as CSSProperties}>
                        {bonus.toLocaleString()}
                      </td>
                      <td style={tdStyle as CSSProperties}>
                        {currentAmt.toLocaleString()}
                      </td>
                      <td style={tdStyle as CSSProperties}>
                        {expectedProfit.toLocaleString()}
                      </td>
                      <td style={tdStyle as CSSProperties}>
                        {percentageProfit}
                      </td>
                      <td style={tdStyle as CSSProperties}>
                        {" "}
                        {estimatedDrawTime}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            <div className={styles.goo}>
              <div className={styles.footertab}>
                <div className={styles.tr}>
                  <span>
                    Total track{" "}
                    <strong>{trackYieldData.trackInfo.total_draws} </strong>
                    draw(s)
                  </span>
                </div>
                <div className={styles.tr}>
                  <span style={{ marginLeft: 20 }}>
                    Total.
                    <strong>{trackYieldData.trackInfo.total_amt_bets} </strong>
                    bet(s)
                  </span>
                </div>
                <div className={styles.tr}>
                  <span>
                    Total Amt.
                    <strong>
                      {fixArithmetic(trackYieldData.trackInfo.total_amt_to_pay)}
                    </strong>
                  </span>
                </div>
                <div className={styles.tr}>
                  <span>
                    Balance:
                    <strong>{balance}</strong>
                  </span>
                </div>
              </div>
              <div className={styles.flowinx}>
                <div className={styles.flowcontain}>
                  <div>
                    <input
                      type="radio"
                      name="stop_if_win"
                      id="stop_if_win"
                      checked={stopIfWin === 1}
                      onChange={handleRadioChange}
                    />
                    <label htmlFor="stop_if_win">Stop if win</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="stop_if_win"
                      id="stop_if_not_win"
                      checked={stopIfNotWin === 1}
                      onChange={handleRadioChange}
                    />
                    <label htmlFor="stop_if_not_win">Stop if not win</label>
                  </div>
                </div>

                <button
                  className={styles.trackbtn}
                  onClick={() =>
                    getTrackYieldData(
                      { ...trackYieldData },
                      { ...trackState },
                      stopIfWin,
                      stopIfNotWin,
                      SetResponse,
                      setBallance
                    )
                  }
                >
                  track
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(Track);

const tableStyle = {
  borderCollapse: "collapse",
  width: "100%",
  border: "1px solid #ddd",
};

const thStyle = {
  backgroundColor: "black",
  color: "white",
  padding: "12px",
  borderBottom: "1px solid #ddd",
  textAlign: "center",
  fontSize: 13,
  fontWeight: 300,
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
  textAlign: "center",
  border: "1px solid #f1f1f1",
};

// const trackCart = (cartState: { items: any }) => {
//   const obj = cartState.items;
//   trackDispatch({
//     type: "TRACK_BET",
//     payload: Object.keys(obj).map((key) => obj[key])
//   });
//   setTrackData(
//     createTrackJson(
//       drawData.drawDateTime,
//       drawData.nextBetId,
//       defaultTrackDraws,
//       firstMultiplier,
//       multiplyAfterEvery,
//       multiplyBy,
//       sumBetAmtAndBets(cartState["items"])[0],
//       sumBetAmtAndBets(cartState["items"])[1]
//       // drawData.drawDateTime
//     )
//   );
//   setTrackYieldData(
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
//     )
//   );

//   console.log(
//     "helllo",
//     createTrackJson(
//       drawData.drawDateTime,
//       drawData.nextBetId,
//       defaultTrackDraws,
//       firstMultiplier,
//       multiplyAfterEvery,
//       multiplyBy,
//       sumBetAmtAndBets(cartState["items"])[0],
//       sumBetAmtAndBets(cartState["items"])[1]
//       // drawData.drawDateTime
//     )
//   );
// };

// const handleMultiplierChange = (event: any) => {
//   setFirstMultiplier(event.target.value);
//   console.log(trackData);
// };

// const handleMultiplyAfterEveryChange = (event: any) => {
//   setMultiplyAfterEvery(event.target.value);
//   console.log(trackData);
// };

// const handleMultiplyByChange = (event: any) => {
//   setMultiplyBy(event.target.value);
// };

// function setFirstYieldMultiplier(e.target.value) any) {
//   setFirstYieldMultiplier(e.target.value);
// }

// function handleMinimumYieldChange(e: any) {
//   setMinimumYield(e.target.value);
// }

// const trackBet = (items: GameData) => {
//   trackDispatch({
//     type: "TRACK_BET",
//     payload: Array(items)
//   });
//   setTrackData(
//     createTrackJson(
//       drawData.drawDateTime,
//       drawData.nextBetId,
//       defaultTrackDraws,
//       firstMultiplier,
//       multiplyAfterEvery,
//       multiplyBy,
//       bet.totalBetAmt,
//       bet.totalBets
//       // drawData.drawDateTime
//     )
//   );
//   setTrackYieldData(
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
//     )
//   );
// };
