'use client';
import { Widget } from '@skip-go/widget';

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <div style={{ width: 500 }}>
        <Widget />
      </div>
    </div>
  );
}
