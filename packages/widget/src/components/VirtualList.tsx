import List, { ListRef } from "rc-virtual-list";
import { getHexColor, opacityToHex } from "@/utils/colors";
import styled, { useTheme } from "styled-components";
import { useEffect, useRef, useState } from "react";
import { Column } from "./Layout";
import { SmallText } from "./Typography";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";

export type VirtualListProps<T> = {
  listItems: T[];
  height?: number;
  itemHeight: number;
  bufferSize?: number;
  renderItem: (
    item: T,
    index: number,
    refSetter?: (el: HTMLDivElement | null) => void,
  ) => React.ReactNode;
  itemKey: (item: T) => string;
  className?: string;
  empty?: {
    header?: string;
    details?: string;
    icon?: React.ReactNode;
  };
  expandedItemKey?: string | null;
};

export const MAX_MODAL_HEIGHT = 600;
export const MOBILE_VERTICAL_MARGIN = 100;

export const useListHeight = (itemHeight: number) => {
  const isMobileScreenSize = useIsMobileScreenSize();
  const [virtualListHeight, setVirtualListHeight] = useState(MAX_MODAL_HEIGHT - itemHeight);

  useEffect(() => {
    const calculateHeight = () => {
      if (isMobileScreenSize) {
        return window.innerHeight - itemHeight - MOBILE_VERTICAL_MARGIN * 2;
      }
      return MAX_MODAL_HEIGHT - itemHeight;
    };

    setVirtualListHeight(calculateHeight());
  }, [isMobileScreenSize, itemHeight]);

  return virtualListHeight;
};

export const VirtualList = <T,>({
  listItems,
  height,
  itemHeight,
  renderItem,
  itemKey,
  className,
  empty,
  expandedItemKey,
}: VirtualListProps<T>) => {
  const theme = useTheme();
  const [currentlyFocusedElement, setCurrentlyFocusedElement] = useState<HTMLElement>();
  const listHeight = useListHeight(itemHeight);

  const listRef = useRef<ListRef>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});

  console.log(expandedItemKey);
  console.log(itemRefs);

  useEffect(() => {
    const listElement = listRef.current?.nativeElement?.getElementsByClassName(
      "rc-virtual-list-holder-inner",
    )?.[0];
    const firstElementInList = listElement?.firstChild as HTMLElement;

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
          setCurrentlyFocusedElement(prevElement);
          prevElement.focus();
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

  useEffect(() => {
    if (!listRef.current || !expandedItemKey) return;

    const el = itemRefs.current[expandedItemKey];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [expandedItemKey]);

  if (listItems.length === 0) {
    return (
      <StyledNoResultsContainer gap={10} height={height ?? listHeight}>
        {empty?.icon}
        <SmallText textAlign="center" fontSize={22}>
          {empty?.header}
        </SmallText>
        <StyledEmptyDetails>{empty?.details}</StyledEmptyDetails>
      </StyledNoResultsContainer>
    );
  }

  return (
    <List
      ref={listRef}
      data={listItems}
      height={height ?? listHeight}
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
          backgroundColor: getHexColor(theme.primary.text.normal) + opacityToHex(50),
        },
      }}
    >
      {(item, index) =>
        renderItem(item, index, (el) => {
          itemRefs.current[itemKey(item)] = el;
        })
      }
    </List>
  );
};

const StyledNoResultsContainer = styled(Column)<{
  height?: number;
}>`
  min-height: ${({ height }) => height}px;
  width: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const StyledEmptyDetails = styled(SmallText)`
  white-space: pre-line;
  text-align: center;
`;
