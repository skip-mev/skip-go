export const RightArrowIcon = ({ color }: { color: string }) => {
  return (
    <svg
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 6.26723H8.75094V6.26558C9.66641 6.26558 10.1233 5.17401 9.47699 4.53546L6.64749 1.74162L8.4103 0L16 7.49836L8.40867 15L6.64582 13.2584L9.47699 10.4613C10.1233 9.8211 9.66474 8.72949 8.75094 8.72949H0V6.26723Z"
        fill={color}
      />
    </svg>
  );
};
