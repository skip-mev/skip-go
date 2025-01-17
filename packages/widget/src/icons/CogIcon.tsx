type IconProps = {
  color?: string;
  height?: number;
  width?: number;
};

export const CogIcon = ({ color = "currentColor", ...props }: IconProps) => (
<svg 
  width="15" 
  height="15" 
  viewBox="0 0 15 15" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  {...props}
>
<path d="M12.6905 9.0162C12.7367 8.86574 12.8407 8.73843 12.9792 8.66898C13.1178 8.59954 13.2795 8.58796 13.4296 8.63426L15 9.16667V5.84491L13.418 6.37731C13.2679 6.42361 13.1062 6.41204 12.9677 6.34259C12.8291 6.27315 12.7252 6.14583 12.679 5.99537C12.5635 5.61343 12.4134 5.25463 12.2171 4.90741C12.1363 4.76852 12.1247 4.60648 12.1709 4.45602C12.2171 4.30556 12.321 4.18981 12.4596 4.12037L13.9608 3.37963L11.6166 1.03009L10.8776 2.5463C10.8083 2.68519 10.6929 2.78935 10.5427 2.83565C10.3926 2.88194 10.231 2.87037 10.0924 2.78935C9.74599 2.60417 9.37645 2.4537 9.00693 2.33796C8.85682 2.29167 8.7298 2.1875 8.66051 2.04861C8.59123 1.90972 8.57968 1.74769 8.62587 1.59722L9.16859 0H5.85451L6.39723 1.59722C6.44342 1.74769 6.43187 1.90972 6.36259 2.04861C6.29331 2.1875 6.16629 2.29167 6.01617 2.33796C5.64665 2.44213 5.28869 2.59259 4.94227 2.77778C4.8037 2.8588 4.64204 2.87037 4.49192 2.82407C4.3418 2.77778 4.22633 2.67361 4.15705 2.53472L3.38338 1.03009L1.02772 3.35648L2.51732 4.12037C2.65589 4.18981 2.75982 4.31713 2.80601 4.45602C2.8522 4.60648 2.84065 4.76852 2.75982 4.90741C2.57506 5.25463 2.4134 5.61343 2.30947 5.99537C2.26328 6.14583 2.15936 6.27315 2.02079 6.34259C1.88222 6.41204 1.72056 6.42361 1.57044 6.37731L0 5.83333V9.16667L1.55889 8.62268C1.70901 8.57639 1.87067 8.58796 2.00924 8.65741C2.14781 8.72685 2.25174 8.85417 2.29792 9.00463C2.40185 9.38657 2.56351 9.76852 2.74827 10.1157C2.8291 10.2546 2.84065 10.4167 2.79446 10.5671C2.74827 10.7176 2.64435 10.8333 2.50578 10.9028L1.01617 11.6204L3.36028 13.9699L4.07622 12.4884C4.1455 12.3495 4.26097 12.2454 4.41109 12.1991C4.5612 12.1528 4.72287 12.1644 4.86144 12.2454C5.20786 12.4421 5.57737 12.5926 5.96998 12.7083C6.1201 12.7546 6.24712 12.8472 6.3164 12.9977C6.38568 13.1366 6.39723 13.2986 6.35104 13.4491L5.81986 15H9.1455L8.61432 13.4491C8.56813 13.2986 8.57968 13.1366 8.64896 12.9977C8.71825 12.8588 8.84527 12.7546 8.99538 12.7083C9.37645 12.5926 9.74599 12.4421 10.0924 12.2454C10.231 12.1644 10.3926 12.1528 10.5427 12.1991C10.6929 12.2454 10.8083 12.3495 10.8776 12.4884L11.6051 13.9699L13.9492 11.6204L12.4711 10.8912C12.3326 10.8218 12.2287 10.706 12.1825 10.5556C12.1363 10.4051 12.1478 10.2431 12.2287 10.1042C12.425 9.75694 12.5866 9.39814 12.6905 9.0162ZM11.2818 7.5C11.2818 9.59491 9.58429 11.2847 7.50578 11.2847C5.42726 11.2847 3.71825 9.58333 3.71825 7.5C3.71825 5.41667 5.41571 3.7037 7.50578 3.7037C9.59589 3.7037 11.2818 5.40509 11.2818 7.5Z" 
  fill={color}
/>

</svg>
);
