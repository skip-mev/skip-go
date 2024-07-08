import { useEffect } from 'react';

export const useFixRadixUiWheelEvent = () => {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if ((e.target as Element).closest('[data-scrollable]')) return;
      e.stopPropagation();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if ((e.target as Element).closest('[data-scrollable]')) return;
      e.stopPropagation();
    };

    document.addEventListener('wheel', handleWheel, true);
    document.addEventListener('touchmove', handleTouchMove, true);

    return () => {
      document.removeEventListener('wheel', handleWheel, true);
      document.removeEventListener('touchmove', handleTouchMove, true);
    };
  }, []);
};
