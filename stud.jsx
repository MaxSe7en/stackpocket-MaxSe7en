import React, { useState, useEffect } from "react";
import styles from "../styles/Stud.module.css";
import { ACTION_TYPES } from "@/games/5d/stateActions";
import { mainStateProvider } from "@/StateContex";
import { selectArray } from "@/functions/msc";

export default function Stud({ Buttons }) {
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
    <div style={{ width: 800 }} className={styles.container2}>
      <div className={styles.gridbox}>
        {Buttons.map((items, i) => {
          const indexData = i + 4;
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
                color: selections[selectArray(1)]?.includes(indexData)
                  ? "white"
                  : null,

                color: isPart ? "white" : "black",
                border: isPart ? "1px solid black" : "1px solid white",
                width: 150,
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
