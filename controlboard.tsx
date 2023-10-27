import { MainStateProvider } from "@/StateContex";
import { long_dragon_url, long_dragon_all_url } from "@/utils/Endpoints";
import React, {
    ChangeEvent,
    createContext,
    useContext,
    useReducer,
    useEffect,
    useMemo,
    useState,
} from "react";
import { childrenProps } from "./interface";

export const ControlBoardLayoutContext = createContext({});

export const ControlBoardLayoutProvider = ({ children }: childrenProps) => {

    const Menu = [
        { game_name: "Current Color", url: long_dragon_url },
        { game_name: "All Colors", url: long_dragon_all_url },
        { game_name: "Customize", url: "" },
        { game_name: "8 Color Species", url: "" },
    ];


    const {  longDragonDispatch,longDragonSelections,standardSelections } = MainStateProvider()
    const [activeTab, setActiveTab] = useState(Menu[0].game_name);

    const memoValue = useMemo(() => ({
        Menu, activeTab, setActiveTab
    }), [activeTab])




    useEffect(() => {
        // longDragonDispatch({
        //     type: "CLEAR",
        // });
    }, [activeTab]);

    return (
        <ControlBoardLayoutContext.Provider value={memoValue}>
            dfdg{JSON.stringify(longDragonSelections)}
            {children}
        </ControlBoardLayoutContext.Provider>
    )

}

export default function useLongDragonControlBoard() {
    return useContext(ControlBoardLayoutContext)
}