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
    const listElement = listRef.current?.nativeElement;
    //@ts-expect-error ignore typescript error
    const onFocus = (e) => {
      setCurrentlyFocusedElement(e?.target);
    };
    listElement?.addEventListener("focusin", onFocus);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
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

    if (listElement) {
      listElement.focus(); // Focus the list for keyboard events
      listElement.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (listElement) {
        listElement.removeEventListener("keydown", handleKeyDown);
      }
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
