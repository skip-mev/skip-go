import { css } from "@/styled-components";

export const styledScrollbar = css`
  scrollbar-gutter: stable both-edges;

  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  &:hover,
  &:focus-visible,
  &.show-scrollbar {
    scrollbar-color: ${({ theme }) => theme.brandColor} transparent;
  }

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 16px;
  }

  &:hover::-webkit-scrollbar-thumb,
  &:focus-visible::-webkit-scrollbar-thumb,
  &.show-scrollbar::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brandColor};
  }

  &:hover::-webkit-scrollbar-thumb:hover,
  &:focus-visible::-webkit-scrollbar-thumb:hover,
  &.show-scrollbar::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.primary.text.lowContrast};
  }

  &::-webkit-scrollbar-corner { background: transparent; }
`