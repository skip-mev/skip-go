type IconProps = {
  color?: string;
  backgroundColor?: string;
  className?: string;
};

export const SignatureIcon = ({
  backgroundColor = "currentColor",
  className,
  ...props
}: IconProps & React.SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={17}
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.186 8.078c-.426.04-.66.274-.7.701a21.73 21.73 0 01-.854 6.46c-.06.183-.04.377.061.58.102.223.315.345.64.365.346-.02.58-.193.701-.518.203-.751.406-1.706.61-2.864.182-1.138.274-2.469.274-3.992-.04-.447-.285-.691-.732-.732zm-.03-2.499c-.955.02-1.717.325-2.286.914a3.065 3.065 0 00-.853 2.164 20.712 20.712 0 01-.396 4.358.76.76 0 00.091.548.667.667 0 00.457.305c.204.04.386.01.549-.091a.78.78 0 00.335-.457c.305-1.544.447-3.088.427-4.632 0-.427.142-.803.426-1.128.285-.325.701-.498 1.25-.518.488.02.894.193 1.219.518.325.325.498.721.518 1.189a26.355 26.355 0 01-.305 4.357.66.66 0 00.122.549.667.667 0 00.457.305c.305.02.518-.051.64-.214.142-.162.213-.294.213-.396.244-1.524.356-3.057.336-4.601-.04-.894-.356-1.636-.945-2.225-.61-.59-1.361-.904-2.255-.945zM4.804 5c-.386-.264-.732-.233-1.036.092a5.33 5.33 0 00-1.189 3.413 17.334 17.334 0 01-.274 3.413c-.04.183 0 .366.122.548a.667.667 0 00.457.305c.305.02.518-.05.64-.213.142-.163.203-.285.183-.366.223-1.24.325-2.478.304-3.718.02-.914.305-1.737.854-2.468.284-.366.264-.701-.061-1.006zm3.291-1.92c-.447 0-.904.051-1.371.153-.427.122-.61.416-.549.883.142.427.427.61.853.549a4.911 4.911 0 011.067-.122c1.178.04 2.174.447 2.986 1.22.793.771 1.21 1.736 1.25 2.894.02 1.138-.03 2.286-.152 3.444-.02.447.193.721.64.823.243 0 .436-.072.579-.214.142-.142.213-.284.213-.426.142-1.22.203-2.438.183-3.657-.061-1.544-.63-2.834-1.707-3.87C11.031 3.7 9.7 3.14 8.095 3.08zm7.71 3.718c-.142-.426-.437-.62-.884-.579a.779.779 0 00-.426.335c-.122.163-.163.346-.122.549.081.325.122.63.122.914.02.285.03.6.03.945.04.447.284.7.732.762.446-.04.69-.285.73-.732v-.03c.042-.63-.02-1.351-.182-2.164zm-1.25-2.773a7.78 7.78 0 00-2.833-2.499A7.896 7.896 0 008.065.581c-2.195 0-4.043.742-5.547 2.225C1.076 4.27.354 6.036.354 8.11v.64c.061.447.305.7.732.761h.03a.671.671 0 00.488-.213.61.61 0 00.213-.487v-.732c.02-1.645.6-3.057 1.737-4.236 1.24-1.198 2.743-1.798 4.51-1.798a6.515 6.515 0 012.987.762 6.656 6.656 0 012.347 2.042c.284.345.62.406 1.005.183.325-.285.376-.62.153-1.006z"
      fill={backgroundColor}
    />
  </svg>
);
