import { createStyles, rem } from "@mantine/core";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { MainStateProvider } from "@/StateContex";
import { standard_games } from "@/utils/Endpoints";
import { useRouter } from "next/router";
import { fetcher } from "@/services/global/api";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Notify2 from "../Shared/Notify2";
import { isEmpty, reducerSelectionsArray } from "@/functions/msc";
import { FiLock } from "react-icons/fi";
import { ACTION_TYPES } from "@/games/5d/stateActions";

export default function SideNavbar({width='9.5vw'}) {
  const {
    setSideBarData,
    lotteryData,
    setLotteryData,
    sideBarData,
    getDrawAndPeriodList,
    drawData,
    setDrawData,
    standardSelectionsDispatch,
  }: any = MainStateProvider();

  const router = useRouter();
  const { lt } = router.query;

  const [disableButtonFetch, setDisableButtonFetch] = useState(false);

  const handlenavigation = async (lottery_type_id: any, gameTypeId: any) => {
    const gameplayData: any =
      JSON.parse((localStorage as any).getItem("gameplay"))?.[
        lottery_type_id
      ] || {};
    console.log("gameplayData", gameplayData);
    if (isEmpty(gameplayData)) {
      return;
    }
    if (gameTypeId == lt) return;

    setDrawData({ ...drawData, drawNumbers: [] });
    setDisableButtonFetch(true);

    router.push(
      `/gameplay?lti=${lottery_type_id}&lt=${gameTypeId}` //lti = lottery_type_id, lt = game_type_id
    );

    // // console.log("results", results);

    console.log("gameTypeId", gameTypeId, lt);

    setTimeout(() => {
      (async () => {
        const results: any = await getDrawAndPeriodList(gameTypeId);
        console.log("results", results);
        setDisableButtonFetch(false);
      })();
    }, 500);

    // Clear all rows in standardSelections
    standardSelectionsDispatch({
      type: ACTION_TYPES.CLEAR_ALL_ROWS,
      payload: reducerSelectionsArray([]),
    });
  };

  const handleGamePlayData = async (lottery_type_id: number) => {
    const gameplayData: any =
      JSON.parse((localStorage as any).getItem("gameplay")) || {};
    console.log("lottery_id", gameplayData);

    if (!gameplayData.hasOwnProperty(lottery_type_id)) {
      // gameplayData.set(lottery_id, data.data);
      const { data }: any = await fetcher(standard_games, "POST", {
        lottery_type_id,
      });
      console.log("opppppppp", data)
      if (data.type == "error") {
        Notify2(data.message, "top-right", "error");
        return;
      }

      gameplayData[lottery_type_id] = data.data;
      localStorage.setItem("gameplay", JSON.stringify(gameplayData));
    }
    console.log("lottery_id", gameplayData);
  };

  useEffect(() => {
    localStorage.removeItem("nextBetId");
  }, [lt])

  return (
    <div  className={styles.flowbite}>
      <Sidebar
        backgroundColor="#1F4D93"
        width={width}
        style={{
          height: "100%",
          background: "#1F4D93",
          opacity: 1,
          color: "white",
          position: "fixed"
        }}
      >
        <Menu
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              if (level === 0) {
                return {
                  color: "white",
                  backgroundColor: active ? "#fff" : undefined,
                  "&:hover": {
                    backgroundColor: "#335B8C !important",
                    color: "white !important",
                  },
                };
              }
            },
          }}
        >
          <SubMenu
            onClick={() => {
              setSideBarData({ ...sideBarData, activeSideBar: true });
              setLotteryData({
                ...lotteryData,
                lottery_type_id: lotteryData.lottery_id,
                lottery_name: lotteryData.lottery_name,
                lobby: lotteryData.lottery_name,
              });
            }}
            label={`Lottery (${lotteryData?.lottery_game_list?.length})`}
            className={styles.lotterySubMenu}
          >
            {lotteryData?.lottery_game_list?.map((item: any, indx: any) => (
              <SubMenu
                style={{ color: "black" }}
                onClick={() => handleGamePlayData(item.lottery_id)}
                // backgroundColor="#1F4D93"
                key={indx}
                label={
                  item.lottery_name !== "5D" ? (
                    <div>
                      {item.lottery_name} {item.lottery_id}
                      <span
                        style={{
                          color: "#1F4D93",
                          fontSize: 13,
                          fontWeight: 900,
                          marginLeft: 10,
                        }}
                      >
                        {item?.sub_game_types?.length > 0 ? "" : "coming soon"}
                      </span>
                    </div>
                  ) : (
                    item.lottery_name 
                  )
                }
              >
                {item?.sub_game_types?.map((x: any, y: any) => (
                  <MenuItem
                    className={`${styles.lotterySubMenuItems} 
                    ${
                      lt == x.game_type_id ? styles.active : ""
                    }`}
                    style={
                      {
                        // textAlign: "left",
                        // color: game_type_id != x.game_type_id ? "#1F4D93" : "#fff",
                        // backgroundColor:
                        //   game_type_id == x.game_type_id ? "red" : "transparent ",
                      }
                    }
                    onClick={() =>
                      handlenavigation(item.lottery_id, x.game_type_id)
                    }
                    key={y}
                    disabled={disableButtonFetch}
                  >
                    <div>
                       {x.game_type_name}  &nbsp;&nbsp;&nbsp;{" "}
                    </div>
                    {disableButtonFetch && (
                      <FiLock size={10} style={{ marginLeft: 5 }} />
                    )}
                  </MenuItem>
                ))}
              </SubMenu>
            ))}
          </SubMenu>
          <SubMenu style={{fontSize:13}}label="Sports"></SubMenu>
          <SubMenu style={{fontSize:13}}label="Jackpot"></SubMenu>
          <SubMenu style={{fontSize:13}}label="Casino"></SubMenu>
          <SubMenu style={{fontSize:13}}label="Chess & cards"></SubMenu>
          <SubMenu style={{fontSize:13}}label="Virtual Games"></SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    // display:'none'
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));
