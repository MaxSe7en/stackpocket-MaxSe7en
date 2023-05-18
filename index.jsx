import { INITIAL_STATE } from '@/games/5d/stateActions';
import { Reducer } from '@/games/5d/useReducer';
import axios from 'axios';
import React, { useState, useContext, useReducer } from 'react'
import { useMemo } from 'react';
import { createContext } from 'react';



export const StateContext = createContext();
export const StateProvider = ({ children }) => {
  const [sessionCookies, setSessionCookies] = useState(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [userToken, setUserToken] = useState('')
  const [selectedGame, setSelectedGame] = useState([])
  const [selectedTabGame, setSelectedTabGame] = useState([])
  const [selectedGameId, setselectedGameId] = useState(1)
  const [lotteryName, setLotteryName] = useState('')
  const [gameFunctionsData, setGameFunctiondata] = useState([])
  const [gameGroupId, setGamegroupId] = useState(1)
  const [lottery_type, setLottery_type] = useState('')
  const [lottery_type_id, setLottery_type_id] = useState('')
  const [loading, setLoading] = useState(false)
  const [balance, setBallance] = useState(0.00)
  const [gameType_id, setGameType_id] = useState(0)
  const [betId, setBetId] = useState('')
  const [game_type_name, setGame_type_name] = useState('')
  const [userData, setUserData] = useState([])
  const [sample, setSample] = useState('')
  const [rows, setRows] = useState(1)
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(9)
  const [columnSelection, setColumnSelection] = useState(0)
  const [rowSelection, setRowSelection] = useState(0)
  const [showRowName, setShowRowName] = useState(0)
  const [startingPoint, setStartingPoint] = useState(0)
  // const [game_selections,setGameSelections] = useState([])
  const [selections, dispatch] = useReducer(Reducer, INITIAL_STATE);
  const [draw_periods, setDraw_periods] = useState([])
  const [next_draw_date, setNextDrawDate] = useState()
  const [endingPoint, setEndingpoint] = useState('')
  const [draw_date_time, setDrawdateTime] = useState('')
  const [nextDrawDatetime, setnextDrawDatetime] = useState('')
  const [drawData, setdrawData] = useState({})
  const [open, setOpen] = React.useState(false);
  const [gameModels, setGameModels] = useState('')
  const [globaldrawNumber, setGlobalDrawNumber] = useState('')
  const [unit, setUnit] = useState(1)





  const [isLoading, setIsLoading] = useState(true)



  const values = useMemo(() => (
    {
      sessionCookies, setSessionCookies,
      username, setUsername,
      email, setEmail,
      userToken, setUserToken,
      selectedGame, setSelectedGame,
      selectedTabGame, setSelectedTabGame,
      selectedGameId, setselectedGameId,
      lotteryName, setLotteryName,
      gameFunctionsData, setGameFunctiondata,
      gameGroupId, setGamegroupId,
      lottery_type, setLottery_type,
      lottery_type_id, setLottery_type_id,
      loading, setLoading,
      balance, setBallance,
      gameType_id, setGameType_id,
      betId, setBetId,
      game_type_name, setGame_type_name,
      userData, setUserData,
      sample, setSample,
      rows, setRows,
      start, setStart,
      end, setEnd,
      columnSelection, setColumnSelection,
      rowSelection, setRowSelection,
      showRowName, setShowRowName,
      startingPoint, setStartingPoint,
      selections, dispatch,
      draw_periods, setDraw_periods,
      next_draw_date, setNextDrawDate,
      endingPoint, setEndingpoint,
      drawData, setdrawData,
      draw_date_time, setDrawdateTime,
      nextDrawDatetime, setnextDrawDatetime,
      open, setOpen,
      gameModels, setGameModels,
      globaldrawNumber, setGlobalDrawNumber,
      unit, setUnit
    }
  ))





  return (
    <StateContext.Provider value={values}>{children}</StateContext.Provider>
  )
}


export const mainStateProvider = () => useContext(StateContext)
