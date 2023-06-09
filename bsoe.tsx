import { ACTION_TYPES } from "@/games/5d/stateActions";
import { mainStateProvider } from "@/StateContex";
import React from "react";
import styles from "../../styles/BSOE.module.css";
import { selectArray } from "@/functions/msc";

const Buttons = [
  {
    position: "1st",
    labels: ["Big", "Small", "Odd", "Even"],
  },
  {
    position: "2nd",
    labels: ["Big", "Small", "Odd", "Even"],
  },
  {
    position: "3nd",
    labels: ["Big", "Small", "Odd", "Even"],
  },
];

function BOSE_FIRST3() {
  const { dispatch, selections, unit, userData } = mainStateProvider();

  return (
    <div>
      <div className={styles.bay}>
        {Buttons.map((item, i) => (
          <div key={i} className={styles.bflow}>
            <div className={styles.gt}>{item.position}</div>
            <div className={styles.gt2}>
              {item.labels.map((x, c) => (
                <button
                  key={c}
                  onClick={() => {
                    dispatch({
                      type: ACTION_TYPES.ON_SELECT,
                      payload: {
                        game_id: x, // same as name
                        userSelection: [c + 1], // same as id
                        rowId: selectArray(i + 1), // same as type
                      },
                    });
                  }}
                  className={styles.bu}
                  style={{
                    backgroundColor: selections[selectArray(i + 1)]?.includes(
                      c + 1
                    )
                      ? "#2F324B"
                      : null,
                    color: selections[selectArray(i + 1)]?.includes(c + 1)
                      ? "white"
                      : null,
                    marginRight: 1.3,
                  }}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BOSE_FIRST3;
