import { ReactNode, useEffect, useState } from 'react';

export const useForceClientRender = (reactNode: ReactNode) => {
  const [node, setNode] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNode(reactNode);
    }
  }, []);

  return node;
};
