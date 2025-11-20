"use client";

import styles from "./CircleBackground.module.css";

export default function CircleBackground() {
  return (
    <div className={styles.circles}>
              <div className={styles.ring3}></div>
                    <div className={styles.ring2}></div>
      <div className={styles.ring1}></div>


    </div>
  );
}
