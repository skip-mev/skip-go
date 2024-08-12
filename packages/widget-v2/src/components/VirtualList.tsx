import List from 'rc-virtual-list';
import { getHexColor, opacityToHex } from '../utils/colors';
import { useTheme } from 'styled-components';

export type VirtualListProps<T> = {
  listItems: T[];
  height: number;
  itemHeight: number;
  bufferSize?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  itemKey: (item: T) => string;
  className?: string;
};

export const VirtualList = <T extends unknown>({
  listItems,
  height,
  itemHeight,
  renderItem,
  itemKey,
  className,
}: VirtualListProps<T>) => {
  const theme = useTheme();

  return (
    <List
      data={listItems}
      height={height}
      itemHeight={itemHeight}
      itemKey={itemKey}
      virtual
      className={className}
      styles={{
        verticalScrollBar: {
          backgroundColor: 'transparent',
          visibility: 'visible',
        },
        verticalScrollBarThumb: {
          backgroundColor: getHexColor(theme.textColor) + opacityToHex(50),
        },
      }}
    >
      {(item, index) => renderItem(item, index)}
    </List>
  );
};
