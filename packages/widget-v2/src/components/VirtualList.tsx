import List, { ListRef } from "rc-virtual-list";
import { getHexColor, opacityToHex } from "@/utils/colors";
import { useTheme } from "styled-components";
import { useEffect, useRef, useState } from "react";

export type VirtualListProps<T> = {
  listItems: T[];
  height: number;
  itemHeight: number;
  bufferSize?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  itemKey: (item: T) => string;
  className?: string;
};

export const VirtualList = <T,>({
  listItems,
  height,
  itemHeight,
  renderItem,
  itemKey,
  className,
}: VirtualListProps<T>) => {
  const theme = useTheme();
  const [currentlyFocusedElement, setCurrentlyFocusedElement] = useState<HTMLElement>();

  const listRef = useRef<ListRef>(null);

  useEffect(() => {
    const listElement = listRef.current?.nativeElement?.getElementsByClassName("rc-virtual-list-holder-inner")?.[0];
    const firstElementInList = (listElement?.firstChild as HTMLElement);

    const handleKeyDown = (event: KeyboardEvent) => {

      if (event.key === "ArrowDown") {
        if (firstElementInList) {
          firstElementInList.focus();
          setCurrentlyFocusedElement(firstElementInList);
        }

        event.preventDefault();
        const nextElement = currentlyFocusedElement?.nextElementSibling as HTMLElement;
        if (nextElement) {
          nextElement.focus();
          setCurrentlyFocusedElement(nextElement);
        }
      } else if (event.key === "ArrowUp") {

        event.preventDefault();
        const prevElement = currentlyFocusedElement?.previousElementSibling as HTMLElement;
        if (prevElement) {
          prevElement.focus();
          setCurrentlyFocusedElement(prevElement);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentlyFocusedElement, listItems.length]);

  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollTo(0);
    }, 0);
  }, [listItems.length]);

  return (
    <List
      ref={listRef}
      data={listItems}
      height={height}
      itemHeight={itemHeight}
      itemKey={itemKey}
      virtual
      className={className}
      styles={{
        verticalScrollBar: {
          backgroundColor: "transparent",
          visibility: "visible",
        },
        verticalScrollBarThumb: {
          backgroundColor:
            getHexColor(theme.primary.text.normal) + opacityToHex(50),
        },
      }}
    >
      {(item, index) => renderItem(item, index)}
    </List>
  );
};
