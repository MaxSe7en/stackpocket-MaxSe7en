import React, { useCallback, useState, useEffect, useMemo } from 'react'
// import styles from "@/styles/GameDashboard.module.css";
import styles from '../../../styles/MainTimer.module.css'
import LotteryNumbers from "./LotteryBounceEffect";
import { mainStateProvider } from "@/StateContex";
import { addMinutes, convertSecToMin, formatTime, generateDrawPeriods, generateNextBetId, getDateTime } from '@/functions/msc';
import Popover from "react-awesome-popover";
import { RiArrowDropDownLine } from 'react-icons/ri';
import { draw_num_url, sub_games_url } from '@/utils/Endpoints';

const MainTimer = ({ lotteryName, getDrawNumber }) => {

  const {
    setNextDrawDate,
    drawData,
    setnextDrawDatetime,
    setdrawData,
    setDrawdateTime,
    next_draw_date,
    betId,
    setBetId,
    selectedGame,
    lottery_type,
    selectedGameId,
    setselectedGameId,
    setLotteryName,
    globaldrawNumber,
    setGlobalDrawNumber,
    setDraw_periods,

    setSelectedTabGame
  } = mainStateProvider();


  const [mainTimeLeft, setmainTimeLeft] = useState();
  const [drawNumbers, setDrawNumbers] = useState([]);
  const [loading, setLoading] = useState(false)
  const [draw_time, setdrawTime] = useState("");





  const getGameNames = async (gameid) => {
    setLoading(true);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      lottery_name: gameid
    });
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    if (cachedResult) {
      // Use the cached result
      console.log("Using cached result for", gameid);
      setSelectedTabGame(cachedResult);
      setLoading(false);
      return;
    }

    // Fetch the data and cache the result
    fetch(sub_games_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("mina ", result.data);
        if (result.data.length === 0) {
          // game id for lottery name
          getLotteryTimeAndDrawNumber(gameid);
        } else {
          getLotteryTimeAndDrawNumber(gameid);
          setSelectedTabGame(result.data);
          // Cache the result
          const cacheKey = `getGameNames_${gameid}`;
          localStorage.setItem(cacheKey, JSON.stringify(result.data));
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    if (selectedGameId) {
      getGameNames(selectedGameId);
    }
  }, [selectedGameId]);

  const [randomNumber, setRandomNumber] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("randomNumber") || 0
      : 0
  );

  const [timeRemaining, setTimeRemaining] = useState(
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("timeRemaining")) || 10
      : 10
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    if (timeRemaining === 0) {
      getLotteryTimeAndDrawNumber(selectedGameId);
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [timeRemaining]);

  useEffect(() => {
    setDrawNumbers((prev) => [
      ...prev,
      randomNumber.toString().split("").map(Number)
    ]);
    console.log("history :", drawNumbers);
  }, [randomNumber]);



  const RenderTimer = useCallback(
    ({ randomNumber }) => (
      <center>
        <div
          style={{
            // marginTop: 70,
            // padding: 10,
            width: 350,
            overflow: "hidden"
          }}
        >
          <LotteryNumbers
            id={styles.numb}
            numbers={randomNumber.toString().split(",").map(Number)}
          />
        </div>
      </center>
    ),
    [randomNumber]
  );


  const getLotteryTimeAndDrawNumber = async (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
      lottery_id: id
    });
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    const lottery_data = await fetch(
      draw_num_url,
      requestOptions
    );

    let json_data = await lottery_data.json();

    if (json_data.type === "success") {
      let drawNumber = json_data.drawinfo.draw_number;
      let timeRemain = json_data.timeLeft;
      let TotalTime = json_data.totaltime;
      let bet_id = json_data.drawinfo.draw_date;
      let draw_date_time = json_data.drawinfo.draw_datetime;



      // let intervalMinutes = 1
      let draw_time = json_data.drawinfo.draw_time;
      let intervalMinute = convertSecToMin(TotalTime);
      let next_draw_date_time = getDateTime(
        addMinutes(json_data.drawinfo.draw_datetime, intervalMinute)
      );

      let inMin = convertSecToMin(TotalTime);
      let date_res = generateNextBetId(bet_id, draw_time, inMin);

      setdrawData({
        betId: bet_id,
        drawDateTime: draw_date_time,
        nextBetId: date_res,
        nextDrawDatetime: next_draw_date_time
      });
      setdrawTime(draw_time);
      setDrawdateTime(draw_date_time);
      setnextDrawDatetime(next_draw_date_time);


      setTimeRemaining(timeRemain);
      setmainTimeLeft(TotalTime);
      setRandomNumber(drawNumber);
      getDrawNumber(drawNumber);
      setGlobalDrawNumber(drawNumber)
      setBetId(bet_id);
      console.log("betIIIIDDD::", drawData);
      console.log("*******dd******", drawNumber);
      console.log("****tt*******", timeRemain);
    } else {
      setTimeRemaining(0);
      setmainTimeLeft(0);
      setRandomNumber("0,0,0,0,0");
      getDrawNumber("0,0,0,0,0");
    }
  };

  const cachedResult = useMemo(() => {
    const cacheKey = `getGameNames_${selectedGameId}`;
    if (typeof localStorage !== "undefined") {
      // Your code that uses localStorage
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        getLotteryTimeAndDrawNumber(selectedGameId);
        return JSON.parse(cachedData);
      }
      return null;
    } else {
      // Handle the case where localStorage is not available
    }
  }, [selectedGameId]);

  useEffect(() => {
    let drawPeriodsArr = generateDrawPeriods(betId, draw_time, mainTimeLeft)
    setDraw_periods(drawPeriodsArr);
  }, [drawData]);

  useEffect(() => {
    let inMin = convertSecToMin(mainTimeLeft);
    let date_res = generateNextBetId(betId, draw_time, inMin);
    setNextDrawDate(date_res);
  }, [betId, draw_time]);

  return (
    <>
      <div className={styles.container}>
        {!loading ? (
          <>
            <div className={styles.name}>
              <div className={styles.nametxt}>
                {lotteryName}
                <Popover action="click">
                  <div className={styles.around}>
                    <RiArrowDropDownLine style={{ marginTop: 0 }} size={40} />
                  </div>
                  <div className={styles.boardy}>
                    <div className={styles.gametit}> {lottery_type} Games </div>
                    {selectedGame &&
                      selectedGame.map((item, i) => {
                        if (item.status === "active") {
                          return (
                            <div
                              key={i}
                              onClick={() => {
                                setselectedGameId(item.lottery_id);

                                // console.log('****|||||||***',item.lottery_id)
                                setLotteryName(item.name);
                              }}
                              style={{
                                background:
                                  item.name === lotteryName ? "#24ACFA" : "none",
                                color:
                                  item.name === lotteryName ? "white" : "black"
                              }}
                              className={styles.ga}
                            >
                              {item.name}
                            </div>
                          );
                        }
                      })}
                  </div>
                </Popover>
              </div>

            </div>
            <div className={styles.timecode}>
              <div className={styles.timebox}>
                <div className={styles.code}>
                  No. {next_draw_date}
                </div>
                <div className={styles.time}>
                  {loading ? 'loading...' :
                    <div className={styles.timeseries}>
                      {formatTime(timeRemaining)}
                    </div>
                  }

                </div>
                {/* <div className={styles.barbox}>
          <div
            style={{
              width: (timeRemaining / mainTimeLeft) * 100 + "%",
              transition: 0.3 + "s"
            }}
            className={styles.bar}
          ></div>
        </div> */}
              </div>
            </div>
            <div className={styles.drawnumber}>
              <div className={styles.code}>
                No.{betId}
              </div>
              <RenderTimer randomNumber={randomNumber} />
            </div>
          </>
        ) : <center><div style={{ width: '100%', color: 'white', padding: 5 }} >Loading... </div></center>}

      </div>
      <div className={styles.barbox}>
        <div
          style={{
            width: (timeRemaining / mainTimeLeft) * 100 + "%",
            transition: 0.3 + "s"
          }}
          className={styles.bar}
        ></div>
      </div>
    </>
  )
}

export default MainTimer;