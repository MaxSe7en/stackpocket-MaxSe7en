import React, { useEffect, useContext, useState } from "react"
import styles from "../../styles/ReportCenter.module.css"
import axios from "axios"
import Navbar from "@/components/uiComponents/Navigations/Navbar"
import ReportCenterNavigation from "@/components/uiComponents/Navigations/ReportCenterNavigation"
import { GoCalendar } from "react-icons/go"
import { StateContext, mainStateProvider } from '../../StateContex/index'
import { BET_COLUMNS } from "@/components/table"
import AppTable from "@/components/AppTable"
import CustomTablePagination from "@/components/CustomTablePagination"
import { useBetRecord } from "@/StateContex/GameContext"
import { apiClient } from "@/utils/config"
import { MoonLoader } from "react-spinners"
// import { decryptAndUse, decryptAndUse2, encryptAndStore } from "@/utils/index_joe"
import { SlRefresh } from 'react-icons/sl'
import { CiSearch } from 'react-icons/ci'
import { useAppQuery } from "@/hooks/useAppQuery"
import BaseTable from "@/components/BaseTable"




const BettingRecord = () => {


    // aframson77@gmail.com  =====  Salvation@77

    //const [betRecords, setBetRecords] = useState<BetRecord[]>([])
    //const [lotteryName, setLotteryName] = useState<LotteryName[]>([])

    const { globaldrawNumber, mainTimeLeft } = mainStateProvider()
    const { setBetRecords } = useBetRecord()


    const filterDate: string[] = ["all", "today", "yesterday","3days ago"]
    const [filterColor, setFilterColor] = useState(0)
    const [todaysDate, setTodaysDate] = useState(new Date().toISOString().slice(0, 10))
    const [queryTime, setQueryTime] = useState("all")
    const [currentHour, setCurrentHour] = useState(0)
    const [currentMinute, setCurrentMinute] = useState(0)
    const [currentSecond, setCurrentSecond] = useState(0)
    const [currentLotteryName, setCurrentLotteryName] = useState(1)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)



    const handlePageIndexChange = (pageIndex: number) => {
        setPageIndex(pageIndex)
        console.log("pageIndex: ", pageIndex)
    }

    const handlePageSizeChange = (pageSize: number) => {
        setPageSize(pageSize)
    }


    const onSuccess = (data: any) => {
        console.log("Success from useQuery: ", data)
        if (data?.results?.length === 0) {
            console.log("No data found")
        }
    }

    const onError = (error: any) => {
        console.log("Error from useQuery: ", error)
        if (error?.message === "Network Error") {

        }
    }

    const handleLotteryNameSelection = (lotteryId: number) => {
        setCurrentLotteryName(lotteryId)
        
    }


    const url = `/betrecords.php?gameType=${currentLotteryName}&limit=${pageSize}&page=${pageIndex}&time=${queryTime}`
    console.log("url  ", url)
    const hourAndMinute = `${currentHour}_${currentMinute}_${currentSecond}`
    const queryKeys = [`betrecords_${currentLotteryName}`, pageIndex, pageSize, queryTime + hourAndMinute]
    const params = { onSuccess, onError, url, queryKeys, fetchInterval: "5000" }
    const { isLoading, data: betRecords, isError, error, isSuccess, isFetching } = useAppQuery(params)
    setBetRecords(betRecords?.results)

    const lotteryNamesUrl = "/alllotterygames.php"
    const lotteryNamesQueryKeys = ['lotteryNames_1']
    const lotteryNamesParams = { onSuccess, onError, url: lotteryNamesUrl, queryKeys: lotteryNamesQueryKeys }
    const { data: lotteryNames } = useAppQuery(lotteryNamesParams)


    console.log("betRecords: ", betRecords)

    const handleDateTimeFilter = (index: number, time: string) => {

        setFilterColor(index)
        const currentDate = new Date()
        const hour = currentDate.getHours()
        const minute = currentDate.getMinutes()
        const second = currentDate.getSeconds()
        const query = time === "3days ago" ? "threeDays" : time
        setQueryTime(query)
        
        setCurrentHour(hour)
        setCurrentMinute(minute)
        setCurrentSecond(second)
        if(query === "today" || query === "yesterday" || query === "threeDays"){
            setPageIndex(1)
            setPageSize(10) 
        }
    }



useEffect(() => {

}, [globaldrawNumber])



    return (
        <>

            <Navbar>
                <ReportCenterNavigation>
                    { error ? (<div className={styles.nonetwork}>No Network Connectivity, come back later</div>) : (<section style={{ backgroundColor: "#fff", opacity: 0.9 }}>
                        <section style={{ display: "flex", alignItems: "center", justifyContent:"center", gap: "2rem", }}>
                            <div className={styles.line}></div>
                            <div className={styles.container}>
                                <div className={styles.gametypes}>
                                    <div className={styles.gametypesinner2}>
                                        <div>
                                            <label htmlFor="">Lottery Name</label>
                                            <select name="" id="" className={styles.select} onChange={(e) => handleLotteryNameSelection(Number(e.target.value))}>
                                                {
                                                    lotteryNames?.data && lotteryNames?.data?.map((lottery: any, index: number) => (
                                                        <>
                                                            <option key={index} value={lottery.gt_id}>{lottery.name}</option>
                                                        </>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.filters}>
                            <div className={styles.filtertime}> <div>query time</div> <div> <GoCalendar color="#24ACFA" size={25} /> 2023-03-21 03:00:00 至 2023-03-22 03:00:00</div> </div>
                            <div className={styles.filterdatetime}>
                                {
                                    filterDate.map((date, index) => (
                                        <>
                                            <div
                                                onClick={() => handleDateTimeFilter(index, date)}
                                                className={`${index === filterColor ? styles.filterItem : null}`} >
                                                {date}
                                            </div>
                                            { index <= 1 && <div className={styles.line2}></div> }
                                        </>
                                    ))
                                }
                            </div>
                        </div>
                        </section>
                        <div className={styles.betTable}>
                               <BaseTable
                                data={betRecords}
                                columns={BET_COLUMNS}
                                isLoading={isLoading}
                                error={error}
                                isSuccess={isSuccess}
                                onPageIndexChange={handlePageIndexChange}
                                onPageSizeChange={handlePageSizeChange}
                               />
                            {
                                isLoading &&
                                <div className={styles.loader}>
                                    <MoonLoader size={80} color="#4db9f8" />
                                </div>
                            }

                        </div>
                    </section>)}
                </ReportCenterNavigation>
            </Navbar>
        </>
    )
}

export default BettingRecord