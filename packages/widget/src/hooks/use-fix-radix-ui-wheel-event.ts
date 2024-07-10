import { useEffect } from 'react';

export const useFixRadixUiWheelEvent = () => {
  useEffect(() => {
    const element = document.querySelector('react-shadow-scope')?.shadowRoot;
    if (!element) return;

    const handleWheel = (e: Event) => {
      e.stopPropagation();
    };

    const handleTouchMove = (e: Event) => {
      e.stopPropagation();
    };

    element.addEventListener('wheel', handleWheel, true);
    element.addEventListener('touchmove', handleTouchMove, true);

    return () => {
      element.removeEventListener('wheel', handleWheel, true);
      element.removeEventListener('touchmove', handleTouchMove, true);
    };
  }, []);
};
