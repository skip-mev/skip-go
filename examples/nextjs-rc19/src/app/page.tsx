'use client'
import styles from "./page.module.css";

import { Widget } from '@skip-go/widget';

export default function Home() {
  return (
    <div className={styles.page}>
      <Widget />
    </div>
  );
}
