import React, { useEffect, useState, useContext ,useReducer} from "react";
import styles from "@/styles/GameName.module.css";
import "react-tabs-scrollable/dist/rts.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import {mainStateProvider} from '../../../StateContex/index'

import { straightJoint } from "@/functions/betsCalculation";
import gameFunctionMap from './GameFunctionHook'
import {ImWarning} from 'react-icons/im'
import { ACTION_TYPES, INITIAL_CART_STATE, INITIAL_STATE } from "@/games/5d/stateActions";
import { Reducer, cartReducer } from "@/games/5d/useReducer";
import { reducerSelectionsArray } from "../../../functions/msc";

const GameNames = () => {
  const [value, setValue] = React.useState(0);
  const [det, setDet] = useState([]);
  const {userData, selectedGame, setSelectedGame, selectedTabGame, gameFunctionsData,setGameFunctiondata,
    gameGroupId,setGamegroupId ,lotteryName,gameType_id,setGameType_id,
    setSample,
    setRows,
    setStart,
    setEnd,
    setColumnSelection,
    setRowSelection,
    setShowRowName,
    setStartingPoint,
    selections, dispatch,
    game_type_name,setGame_type_name,
    endingPoint,setEndingpoint,
    gameModels,setGameModels,
    unit
   } = mainStateProvider();
  const [anchorEl, setAnchorEl] = React.useState(null);



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const setGamedataId = (game_id)=>{
      let data =  gameFunctionMap(game_id)
      setGameFunctiondata(data)

  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [getValue, setgetValue] = useState("");
  const [gameOdds, setOdds] = useState("");
  const [howToplay, setHowToplay] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


 function  truncate(number, decimalPlaces = 3) {
    let indexOfDecimal = number.toString().indexOf(".");
    if (indexOfDecimal == -1) return number;
    let result = number.toString().slice(0, indexOfDecimal + (decimalPlaces + 1));
    return result
  }


  useEffect(() => {
    // console.log("ffff", selectedTabGame);
    if (selectedTabGame) {
    //  console.log("testing",gameFunctionMap(1)) ;
      const dd = selectedTabGame.map((item) => item.group)[0];
      const sub = selectedTabGame.map((items) => items)[0];
      console.log('riii',sub)
      const game_type_name = selectedTabGame.map(
        (items) => items.subgroup.map((g) => g.games.map((x) => x.name)[0])[0]
      )[0];
      const odds = selectedTabGame.map(
        (items) => items.subgroup.map((g) => g.games.map((x) => x.currentodds)[0])[0]
      )[0];
      const howToplay = selectedTabGame.map(
        (items) => items.subgroup.map((g) => g.games.map((x) => x.guide)[0])[0]
      )[0];
      const sample = selectedTabGame.map(
        (items) => items.subgroup.map((g) => g.games.map((x) => x.sample)[0])[0]
      )[0];
      const rows = selectedTabGame.map(
        (items) => items.subgroup.map((g) => g.games.map((x) => x.rows)[0])[0]
      )[0];
      const end = selectedTabGame.map(
        (items) => items.subgroup.map((g) => g.games.map((x) => x.end)[0])[0]
      )[0];
      const start = selectedTabGame.map(
        (items) => items.subgroup.map((g) => g.games.map((x) => x.start)[0])[0]
      )[0];

    

      const columnSelection = selectedTabGame.map(
        (items) => items.subgroup.map((g) => g.games.map((x) => x.columnSelection)[0])[0]
      )[0];

      const rowSelection = selectedTabGame.map(
        (items) => items.subgroup.map((g) => g.games.map((x) => x.rowSelection)[0])[0]
      )[0];
      const showRowName = selectedTabGame.map(
        (items) => items.subgroup.map((g) => g.games.map((x) => x.showRowName)[0])[0]
      )[0];

      const startingPoint = selectedTabGame.map(
        (items) => items.subgroup.map((g) => g.games.map((x) => x.startingPoint)[0])[0]
      )[0];
      const endPoint = selectedTabGame.map(
        (items) => items.subgroup.map((g) => g.games.map((x) => x.endingPoint)[0])[0]
      )[0];

      const gameModel = selectedTabGame.map(
        (items) => items.subgroup.map((g) => g.games.map((x) => x.model)[0])[0]
      )[0];


      let game_id = selectedTabGame.map(x=>x.subgroup.map(y=>y.games.map(z=>z.game_id)[0])[0])[0]
      let data =  gameFunctionMap(game_id)
      console.log('game_typeID=====++++++:',odds)
      // 
      setGameModels(gameModel)
      setEndingpoint(endPoint)
      setGameType_id(game_id)
      setGameFunctiondata(data)
      setgetValue(dd);
      setDet(sub);
      setGame_type_name(game_type_name)
      setOdds(odds);
      setHowToplay(howToplay);
      setSample(sample)
      setRows(rows)
      setStart(start)
      setEnd(end)
      setColumnSelection(columnSelection)
      setRowSelection(rowSelection)
      setShowRowName(showRowName)
      setStartingPoint(startingPoint)
    }
    console.log('(((((((',userData)
  }, [selectedTabGame]);

  return (
    <div className={styles.container}>
      {selectedTabGame.length === 0?(
        <div className={styles.warn}>
          <center>
            <ImWarning size={50} color={"red"} />
            <h1>No Game for {lotteryName}</h1>
          </center>
        </div>
      ):(
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
              selectedTabGame.map((data, i) => {
                // setDet(data)

                return (
                  <Tab
                    onClick={() => {
                      console.log("indio::", data);
                      setDet(data);
                      setgetValue(data.group);
                      dispatch({
                        type: ACTION_TYPES.CLEAR_ALL_ROWS,
                        payload: reducerSelectionsArray([]),
                      });
                    }}
                    className={`${data.group === getValue ? styles.tab : null}`}
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
        {det &&
          det.subgroup &&
          det.subgroup.map((items, i) => {

            return (
              <div className={styles.listgridbox}>
                {/* {items.games && items.games.map(games => games)} */} {i}
                  <div/>
                  {items.games.map((g)=>g.model === "standard"?(
                    <button className={`${styles.listgrname} `}>
                    {items.name} 
                 </button>
                  ):null)[0]}
                  {/* {items.games && items.games.map((g)=>g.model === "standard"?(
                    <button className={`${styles.listgrname} `}>
                       {items.name} 
                    </button>
                  ):null)[i]} */}
                  {/* 
                    <button className={`${styles.listgrname} `}>
                       {items.name} 
                    </button> */}


                <div className={styles.listgrgames}>
                  {items.games &&
                    items.games.map((games, x) => (
                      <>
                        {games.status === "active" && games.model === gameModels? (
                          <button
                            key={x}
                            onClick={()=>{


                              setEndingpoint(games.endingPoint)
                              setOdds(games.currentodds);
                              setHowToplay(games.guide);
                              setGamedataId(games.game_id);
                              setSample(games.sample)
                              setRows(games.rows)
                              setStart(games.start)
                              setEnd(games.end)
                              setColumnSelection(games.columnSelection)
                              setRowSelection(games.rowSelection)
                              setShowRowName(games.showRowName)
                              setStartingPoint(games.startingPoint)
                              setGame_type_name(games.name)
                              setGameType_id(games.game_id)
                              setGameModels(games.model)


                              dispatch({
                                type: ACTION_TYPES.CLEAR_ALL_ROWS,
                                payload: reducerSelectionsArray([]),
                              });

                            }}
                            className={`${styles.gambutt}   ${
                              games.name === game_type_name ? styles.active : null
                            }`}
                          >
                            {games.name} 
                          </button>
                        ) : null}
                      </>
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
          <span className={styles.home_rebate}>{userData ? (truncate((((85 + userData.rebate ) / 100) * +gameOdds) * unit,4)):(truncate(  (((85 + 15) /100) * +gameOdds) * unit,4))}</span>
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
              horizontal: "left"
            }}
          >
            <Typography style={{width:300}} sx={{ p: 2 }}>{howToplay}</Typography>
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
