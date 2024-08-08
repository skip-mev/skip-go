import { useCallback, useEffect, useMemo, useState } from 'react';
import List from 'rc-virtual-list';
import { getHexColor, opacityToHex } from '../utils/colors';
import debounce from 'lodash/debounce';

export type VirtualListProps<T> = {
  listItems: T[] | undefined;
  height: number;
  itemHeight: number;
  textColor: string;
  bufferSize?: number;
  renderItem: (item: T | null, index: number) => React.ReactNode;
  itemKey: (item: T) => string;
};

export const VirtualList = <T extends unknown>({
  listItems,
  height,
  itemHeight,
  textColor,
  bufferSize = 6,
  renderItem,
  itemKey,
}: VirtualListProps<T>) => {
  const itemsToShow = Math.floor(height / itemHeight);
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: itemsToShow,
  });

  const handleVisibleChange = useCallback(
    (visibleList: T[], fullList: T[]) => {
      if (visibleList.length === 0) return;

      const startIndex = fullList.indexOf(visibleList[0]);
      const endIndex = fullList.indexOf(visibleList[visibleList.length - 1]);

      if (startIndex === -1 || endIndex === -1) return;

      const start = Math.max(0, startIndex - bufferSize);
      const end = Math.min(fullList.length - 1, endIndex + bufferSize);

      setVisibleRange({ start, end });
    },
    [bufferSize]
  );

  const debouncedUpdateVisibleRange = useMemo(
    () => debounce(handleVisibleChange, 300, { maxWait: 500 }),
    [handleVisibleChange]
  );

  useEffect(() => {
    return () => {
      debouncedUpdateVisibleRange.cancel();
    };
  }, [debouncedUpdateVisibleRange]);

  return (
    <List
      data={listItems ?? []}
      height={height}
      itemHeight={itemHeight}
      itemKey={itemKey}
      virtual
      styles={{
        verticalScrollBar: {
          backgroundColor: 'transparent',
          visibility: 'visible',
        },
        verticalScrollBarThumb: {
          backgroundColor: getHexColor(textColor) + opacityToHex(50),
        },
      }}
      onVisibleChange={debouncedUpdateVisibleRange}
    >
      {(item, index) => {
        const isInBufferedRange =
          index >= visibleRange.start && index <= visibleRange.end;
        return renderItem(isInBufferedRange ? item : null, index);
      }}
    </List>
  );
};
