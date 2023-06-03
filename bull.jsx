import React, { useState, useEffect } from "react";
import styles from "../styles/BullBull.module.css";
import { mainStateProvider } from "@/StateContex";
import { selectArray } from "@/functions/msc";
import { ACTION_TYPES } from "@/games/5d/stateActions";

export default function BullBull({Buttons}) {
  const [selected, setSelected] = useState([]);
  const { dispatch, selections } = mainStateProvider();

 

  const getSelection = (items) => {
    if (selected.includes(items)) {
      const left = selected.filter((x) => x !== items);
      setSelected(left);
    } else {
      setSelected((prev) => [...prev, items]);
    }
  };

  useEffect(() => {
    console.log("SELE:", selected);
    const data = selected.map((element) => [element]);
    console.log("data: ", data);
  }, [selected]);

  return (
    <div className={styles.container2}>
      <div className={styles.gridbox}>
        {Buttons.map((items, i) => {
          const indexData = i + 1;
          const isPart = selected.includes(indexData);
          return (
            <div
            //   onClick={() => getSelection(indexData)}
            onClick={() => {
                dispatch({
                  type: ACTION_TYPES.ON_SELECT,
                  payload: {
                    rowId: selectArray(1),
                    userSelection: [indexData],
                    // game_id: items,
                  },
                });
              }}
              style={{
                backgroundColor: selections[selectArray(1)]?.includes(indexData)
                ? "#24ACFA"
                : null,
                color: isPart ? "white" : "black",
                border: isPart ? "1px solid black" : "1px solid white",
              }}
              key={i}
              className={styles.buttons}
            >
              {items}
            </div>
          );
        })}
      </div>
    </div>
  );
}
