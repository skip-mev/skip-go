import { useCallback, useRef } from 'react';
import List from 'rc-virtual-list';
import { getHexColor, opacityToHex } from '../utils/colors';

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
  const visibleRangeRef = useRef({ start: 0, end: itemsToShow + bufferSize });

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
      onVisibleChange={(visibleItems) => {
        const start = Math.max(
          0,
          listItems?.indexOf(visibleItems[0]) ?? 0 - bufferSize
        );
        const end = Math.min(
          listItems?.indexOf(visibleItems[visibleItems.length - 1]) ??
            0 + bufferSize
        );
        visibleRangeRef.current = { start, end };
      }}
    >
      {(item, index) => {
        const min = visibleRangeRef.current.start;
        const max = visibleRangeRef.current.end;

        const isInBufferedRange = index >= min && index <= max;
        return renderItem(isInBufferedRange ? item : null, index);
      }}
    </List>
  );
};
