type IconProps = {
  color?: string;
};

export const ChainIcon = ({ color = 'currentColor' }: IconProps) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.28732 11.1042C3.1309 11.2606 2.93332 11.273 2.69458 11.1413C2.45584 11.0095 2.25826 10.8655 2.10184 10.7091C1.94542 10.5526 1.80136 10.3551 1.66963 10.1163C1.53791 9.87758 1.55026 9.68 1.70668 9.52359L5.36191 5.75722C5.09023 5.68313 4.79592 5.64814 4.47897 5.65226C4.16202 5.65637 3.89652 5.76134 3.68248 5.96715L0.916362 8.73327C0.603525 9.0461 0.459458 9.46596 0.484156 9.99284C0.508854 10.5197 0.677618 10.9396 0.990454 11.2524L1.5585 11.8081C1.87133 12.1209 2.29118 12.2918 2.81807 12.3206C3.34495 12.3494 3.7648 12.2074 4.07764 11.8945L6.84375 9.12843C7.0578 8.92261 7.16276 8.65712 7.15865 8.33193C7.15453 8.00675 7.11954 7.71244 7.05368 7.449L3.28732 11.1042ZM12.2895 1.07705L11.7339 0.509009C11.421 0.196173 11.0012 0.0274085 10.4743 0.00271077C9.9474 -0.0219869 9.52755 0.12208 9.21471 0.434916L6.4486 3.20103C6.24278 3.41508 6.13782 3.68057 6.1337 3.99753C6.12959 4.31448 6.16457 4.60467 6.23867 4.86811L10.005 1.22524C10.1614 1.06882 10.359 1.05647 10.5978 1.18819C10.8365 1.31991 11.0341 1.46398 11.1905 1.6204C11.3469 1.77681 11.491 1.97439 11.6227 2.21313C11.7544 2.45188 11.7421 2.64946 11.5857 2.80587L7.93044 6.57224C8.19388 6.6381 8.48819 6.67309 8.81338 6.6772C9.13856 6.68132 9.40406 6.57635 9.60987 6.36231L12.376 3.59619C12.6888 3.28336 12.8308 2.8635 12.802 2.33662C12.7732 1.80974 12.6024 1.38989 12.2895 1.07705ZM7.91809 4.89281C7.83577 4.81872 7.73904 4.78167 7.6279 4.78167C7.51676 4.78167 7.42415 4.81872 7.35005 4.89281L5.37425 6.86861C5.29193 6.95093 5.25077 7.04766 5.25077 7.1588C5.25077 7.26994 5.29193 7.36256 5.37425 7.43665C5.44835 7.51897 5.54096 7.56014 5.6521 7.56014C5.76324 7.56014 5.85585 7.51897 5.92995 7.43665L7.91809 5.46085C7.99219 5.38676 8.02923 5.29414 8.02923 5.18301C8.02923 5.07187 7.99219 4.97513 7.91809 4.89281Z"
      fill={color}
    />
  </svg>
);
