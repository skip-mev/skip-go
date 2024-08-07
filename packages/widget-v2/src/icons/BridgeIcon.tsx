type IconProps = {
  color?: string;
};

export const BridgeIcon = ({ color = 'black' }: IconProps) => (
  <svg
    width="47"
    height="7"
    viewBox="0 0 47 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.477783 0.000183105H46.4778V1.00416C45.1089 1.01674 44.0032 2.13029 44.0032 3.5021C44.0032 4.87391 45.1089 5.98746 46.4778 6.00004V7.00018H0.477783V5.99322C1.76984 5.89734 2.78833 4.81866 2.78833 3.5021C2.78833 2.18554 1.76984 1.10686 0.477783 1.01098V0.000183105Z"
      fill={color}
    />
  </svg>
);
