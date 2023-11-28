import {
  Navbar,
  Group,
  Code,
  ScrollArea,
  createStyles,
  rem
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { TbReload } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { LinksGroup } from "./NavbarLinksGroup";
import styles from "./page.module.css";
import { MainStateProvider } from "@/StateContex";
import { motion } from "framer-motion";
import { AiFillCloseCircle } from "react-icons/ai";
import { lottery_games_url, lottery_url } from "@/utils/Endpoints";
import axios from "axios";
import { useRouter } from "next/router";
import { fetcher } from "@/services/global/api";
import { useSession } from "next-auth/react";
import { getAllUserDetails, getBalance } from "@/services/msc_data";

export default function SideNavbar({}) {
  const { classes } = useStyles();

  const {
    setSideBarData,
    lotteryData,
    setLotteryData,
    sideBarData,
    userData,
    setUserData
  } = MainStateProvider();

  const router = useRouter();

  const { data: session } = useSession();



  useEffect(() => {
    console.log("uiui:", userData);
    (async () => {
      const res = await fetcher(lottery_url);
      const lottery_data = res.data;
      console.log("lottery_data:", res.data);

      console.log('lobby:', lottery_data.lobby)

      const res1 = await fetcher(lottery_games_url, "POST", {
        lottery_type: lotteryData.lottery_type_id
      });

      const lottery_game_list = res1.data;
      getBalance(session?.user?.name?.token).then(async (balance) => {
        const data = await getAllUserDetails(session?.user?.name?.token)
        console.log('fraaaa',balance)
        setUserData({ ...userData, balance:balance, selectedGame:  lottery_data.lobby })
      })
      // setUserData({ ...userData, selectedGame: lottery_data.lobby });
      
      const lotteryData_list = lottery_data?.data?.map((item) => {
        return {
          label: item.name,
          link: `/game/${item.id}`,
          lottery_id: item.lottery_id
        };
      })
      


      setLotteryData({
        ...lotteryData,
        lottery_game_list: lottery_game_list.data,
        lotteryLink:lotteryData_list
      });
    })();
  }, []);

  // functions | function()
  const mockdata = [
    {
      label: `Lottery (${lotteryData.lotteryLink?.length})`,
      icon: IoIosArrowDown,
      initiallyOpened: false,
      links: lotteryData?.lotteryLink,
      name: "Lottery"
    },
    {
      label: "Sports (0)",
      icon: TbReload,
      links: [],
      name: "Sports"
    },
    {
      label: "Casio (0)",
      icon: TbReload,
      links: [],
      name: "Casino"
    },
    {
      label: "Jackpot (0)",
      icon: TbReload,
      links: [],
      name: "Jackpot"
    },
    {
      label: "Chees & Cards (0)",
      icon: TbReload,
      links: [],
      name: "Chess & Cards"
    },
    {
      label: "Virtual Games (0)",
      icon: TbReload,
      links: [],
      name: "Virtual Games"
    }
  ];
  const links = mockdata.map((item, index) => (
    <LinksGroup {...item} key={index} />
  ));

  const handlenavigation = (data) => {
    const encodeData = encodeURIComponent(JSON.stringify(data));
    const link = `/gameplay/${encodeData}`;
    addItemTotabStorage(data);
    router.push(link);
    // setActiveSideBar(false);
    setSideBarData({ ...sideBarData, activeSideBar: false });
    setLotteryData({
      ...lotteryData,
      lottery_id: data.lottery_id,
      lottery_name: data.name
    });
  };

  // Function to add a new item to the array in localStorage
  const addItemTotabStorage = (newItem) => {
    // Get the existing array from localStorage, or initialize it if it doesn't exist
    const tabs = JSON.parse(localStorage.getItem("tabs")) || [];

    // Check if the item already exists in the array
    
    const itemExists = tabs.some(
      (item) => item.lottery_id === newItem.lottery_id
    );
    // If the item doesn't exist, add it to the array and localStorage
    if (!itemExists) {
      tabs.push(newItem);
      // Save the updated array back to localStorage
      localStorage.setItem("tabs", JSON.stringify(tabs));
      // Update the state to reflect the changes
      setUserData({ ...userData, tabs, activeTab: newItem.lottery_id });
    } else {
      setUserData({ ...userData, activeTab: newItem.lottery_id });
    }
  };






  return (
    <>
      {sideBarData.activeSideBar ? (
        <motion.div
          className={styles.popupsideBar}
          // initial={{ x: 200 }} // Initial position off-screen to the left
          animate={{ x: 0 }} // Target position to move in from the left
          exit={{ x: 200 }} // Exit position to move out to the left
        >
          <div className={styles.subNavhead}>
            <div className={styles.gameTitle}>
              {lotteryData.lottery_name} Games
            </div>
            <div
              className={styles.cancel}
              onClick={() =>
                setSideBarData({ ...sideBarData, activeSideBar: false })
              }
            >
              <AiFillCloseCircle size={30} color={"#fff"} />
            </div>
          </div>

          {lotteryData.lottery_game_list.length > 0 ? (
            lotteryData.lottery_game_list.map((item, index) => (
              <div
                onClick={() => handlenavigation(item)}
                key={index}
                className={styles.gameList}
              >
                {item.name}
              </div>
            ))
          ) : (
            <div className={styles.gameList}>No List for this game Yet</div>
          )}
        </motion.div>
      ) : null}
         
      <Navbar
        style={{ position: "fixed", border: "none" }}
        bg={"#1B4483"}
        height={"100vh"}
        width={{ sm: "13.3vw" }}
        p="md"
        className={`${classes.navbar} ${styles.navbar}`}
        hiddenBreakpoint={'md'}
        fixed
        withBorder={false}
      >
        <Navbar.Section className={classes.header}>
          <Group position="apart">
            {/* <Logo width={rem(120)} /> */}
            <Code sx={{ fontWeight: 700 }}>v3.1.2</Code>
          </Group>
        </Navbar.Section>

        <Navbar.Section grow className={classes.links} component={ScrollArea}>
          <div className={classes.linksInner}>{links}</div>
        </Navbar.Section>

   
        {/* <Navbar.Section className={classes.footer}>
     
      </Navbar.Section> */}
      </Navbar>
    </>
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
    }`
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl
  },

  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`
  }
}));
