import React, { useEffect, useState, useContext, useReducer } from "react";
import styles from "@/styles/GameName.module.css";
import "react-tabs-scrollable/dist/rts.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { mainStateProvider } from "../../../StateContex/index";

import gameFunctionMap from "./GameFunctionHook";
import { ImWarning } from "react-icons/im";
import { ACTION_TYPES } from "@/games/5d/stateActions";
import {
  calculatedUserPrize,
  defaultUserPrize,
  reducerSelectionsArray,
} from "../../../functions/msc";

const GameNames = () => {
  const [value, setValue] = React.useState(0);
  const [det, setDet] = useState([]);
  const {
    userData,
    selectedGame,
    setSelectedGame,
    selectedTabGame,
    gameFunctionsData,
    setGameFunctiondata,
    gameGroupId,
    setGamegroupId,
    lotteryName,
    gameType_id,
    setGameType_id,
    setSample,
    setRows,
    setStart,
    setEnd,
    setColumnSelection,
    setRowSelection,
    setShowRowName,
    setStartingPoint,
    selections,
    dispatch,
    game_type_name,
    setGame_type_name,
    setselectedGameId,
    setLotteryName,
    endingPoint,
    setEndingpoint,
    gameModels,
    setGameModels,
    unit,
    subGames,
    setSubgames,
    gameGroup,
    setGameGroup,
    setUserPrize,
    userPrize,
    groupType_id,
    setGroupType_id,
    checkedBoxes,
    setCheckedBoxes,
  } = mainStateProvider();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setGamedataId = (game_id) => {
    let data = gameFunctionMap(game_id);
    setGameFunctiondata(data);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [getValue, setgetValue] = useState("");
  const [gameOdds, setOdds] = useState("");
  const [howToplay, setHowToplay] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // useEffect(() => {
  //   if (selectedTabGame && selectedTabGame.length > 0) {
  //     const firstItem = selectedTabGame[0];
  //     const subgroup = selectedTabGame.map((items) => items)[0];
  //     const game = subgroup.subgroup[0].games[0];

  //     const {
  //       group,
  //       // subgroup: { games },
  //     } = firstItem;

  //     const {
  //       name,
  //       currentodds,
  //       guide,
  //       sample,
  //       rows,
  //       end,
  //       start,
  //       columnSelection,
  //       rowSelection,
  //       showRowName,
  //       startingPoint,
  //       endingPoint,
  //       model,
  //       game_id,
  //     } = game;

  //     setGameModels(model);
  //     setEndingpoint(endingPoint);
  //     setGameType_id(game_id);
  //     // setGroupType_id(game_id)
  //     setgetValue(group);
  //     setGameGroup(group);
  //     setDet(subgroup);
  //     setGame_type_name(name);
  //     setOdds(currentodds);
  //     setHowToplay(guide);
  //     setSample(sample);
  //     setRows(rows);
  //     setStart(start);
  //     setEnd(end);
  //     setColumnSelection(columnSelection);
  //     setRowSelection(rowSelection);
  //     setShowRowName(showRowName);
  //     setStartingPoint(startingPoint);
  //   }
  // }, [selectedTabGame]);


  useEffect(() => {
    if (selectedTabGame && selectedTabGame.length > 0) {
      const firstItem = selectedTabGame[0];
      const subgroup = selectedTabGame.map((items) => items)[0]
      const game = subgroup.subgroup[0].games[0];

      const {
        group,
        // subgroup: { games },
      } = firstItem;

      const {
        name,
        currentodds,
        guide,
        sample,
        rows,
        end,
        start,
        columnSelection,
        rowSelection,
        showRowName,
        startingPoint,
        endingPoint,
        model,
        game_id,
        subgames
      } = game;


      setSubgames(subgames)
      setGameModels(model);
      setEndingpoint(endingPoint);
      setGameType_id(game_id);
      setgetValue(group);
      setGameGroup(group)
      setDet(subgroup);
      setGame_type_name(name);
      setOdds(currentodds);
      setHowToplay(guide);
      setSample(sample);
      setRows(rows);
      setStart(start);
      setEnd(end);
      setColumnSelection(columnSelection);
      setRowSelection(rowSelection);
      setShowRowName(showRowName);
      setStartingPoint(startingPoint);
    }

  }, [selectedTabGame]);
  return (
    <div className={styles.container}>
      {selectedTabGame.length === 0 ? (
        <div className={styles.warn}>
          <center>
            <ImWarning size={50} color={"red"} />
            <h1>No Game for {lotteryName}</h1>
          </center>
        </div>
      ) : (
        <>
          <div className={styles.groupheader}>
            <Box sx={{ maxWidth: { xs: 1500, sm: 1190 } }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                {selectedTabGame &&
                  selectedTabGame
                    .filter((data) =>
                      data.subgroup.some((group) =>
                        group.games.some((game) => game.model !== "twosides")
                      )
                    )
                    .map((data, i) => {
                      // setDet(data)
                      // console.log("data::", data.subgroup.filter(((item) => item.name === "Group"))[0]?.games.some((game)=> game.game_id === 128))
                      return (
                        <Tab
                          onClick={() => {
                            console.log("indio::", data);
                            if (data.group === "Pick 4") {
                              setCheckedBoxes([1, 2, 3, 4]);
                            }
                            if (data.group === "Pick 3") {
                              setCheckedBoxes([1, 2, 3]);
                            }
                            if (data.group === "Pick 2") {
                              setCheckedBoxes([1, 2]);
                            }
                            setDet(data);
                            setgetValue(data.group);
                            setGameGroup(data.group);
                            // setselectedGameId(data.subgroup[0].games[0].game_id);
                            // setGroupType_id(data.subgroup[0].games[0].game_id);
                            setGameType_id(data.subgroup[0].games[0].game_id);
                            setGame_type_name(data.subgroup[0].games[0].name);
                            setOdds(data.subgroup[0].games[0].currentodds);
                            setHowToplay(data.subgroup[0].games[0].guide);
                            setSample(data.subgroup[0].games[0].sample);
                            setRows(data.subgroup[0].games[0].rows);
                            setStart(data.subgroup[0].games[0].start);
                            setEnd(data.subgroup[0].games[0].end);
                            setColumnSelection(
                              data.subgroup[0].games[0].columnSelection
                            );
                            setRowSelection(
                              data.subgroup[0].games[0].rowSelection
                            );
                            setShowRowName(
                              data.subgroup[0].games[0].showRowName
                            );
                            setStartingPoint(
                              data.subgroup[0].games[0].startingPoint
                            );
                            setEndingpoint(
                              data.subgroup[0].games[0].endingPoint
                            );
                            setGameModels(data.subgroup[0].games[0].model);

                            // console.log('****|||||||***',data.subgroup[0].games[0].game_id)
                            // console.log('****|||||||***',data.subgroup[0].games[0].name)
                            // setLotteryName(data);
                            // console.log('****|||||||***',item.lottery_id)
                            // setLotteryName(data);
                            dispatch({
                              type: ACTION_TYPES.CLEAR_ALL_ROWS,
                              payload: reducerSelectionsArray([]),
                            });
                          }}
                          className={`${data.group === getValue ? styles.tab : null
                            }`}
                          style={{ color: "white" }}
                          key={i}
                          label={data.group}
                        />
                      );
                    })}
              </Tabs>
            </Box>
          </div>
          <div className={styles.nameheader}>
            {det?.subgroup?.map((items, i) => {
              return (
                <div key={i} className={styles.listgridbox}>
                  <div />
                  {items.games?.map((g, index) =>
                    g.model === gameModels ? (
                      <button key={index} className={`${styles.listgrname}`}>
                        {items.name}
                      </button>
                    ) : null
                  )?.[0]}
                  <div className={styles.listgrgames}>
                    {items.games?.map((games, x) => (
                      <div key={x}>
                        {games.game_id}
                        {games.status === "active" && games.model === gameModels ? (
                          <button
                            onClick={() => {
                              console.log('games:', games);
                              setEndingpoint(games.endingPoint);
                              setOdds(games.currentodds);
                              setHowToplay(games.guide);
                              setGamedataId(games.game_id);
                              setGameType_id(games.game_id);
                              setGroupType_id(games.game_id);
                              setSample(games.sample);
                              setRows(games.rows);
                              setStart(games.start);
                              setEnd(games.end);
                              setColumnSelection(games.columnSelection);
                              setRowSelection(games.rowSelection);
                              setShowRowName(games.showRowName);
                              setStartingPoint(games.startingPoint);
                              setGame_type_name(games.name);
                              setGameModels(games.model);
                              setSubgames(games.subgames);
                              console.log('subgames', games.subgames);

                              dispatch({
                                type: ACTION_TYPES.CLEAR_ALL_ROWS,
                                payload: reducerSelectionsArray([]),
                              });
                            }}
                            className={`${styles.gambutt} ${games.name === game_type_name ? styles.active : null
                              }`}
                          >
                            {games.name}
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.flowboardwhite}>
            <div className={styles.items}>{game_type_name}</div>
            <div className={styles.items}>
              {" "}
              <span className={styles.price}>Prize:</span>
              <span className={styles.home_rebate}>
                {userData
                  ? calculatedUserPrize(setUserPrize, gameOdds, unit, userData)
                  : defaultUserPrize(setUserPrize, gameOdds, unit)}
              </span>
            </div>
            <div className={styles.items}>
              <button
                onClick={handleClick}
                style={{ color: "black" }}
                className={styles.howto}
              >
                How to Play
              </button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Typography style={{ width: 300 }} sx={{ p: 2 }}>
                  {howToplay}
                </Typography>
              </Popover>
            </div>

            <div className={styles.items}>Cold Hot</div>
          </div>
        </>
      )}
    </div>
  );
};

export default GameNames;
