'use client';

import { type ReactNode } from 'react';

export function Provider(props: { children: ReactNode }) {
  return <Provider>{props.children}</Provider>;
}
