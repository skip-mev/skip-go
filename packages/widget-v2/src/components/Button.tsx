export type ButtonProps = {
  text?: string;
  onClick?: () => void;
  backgroundColor?: string;
  primary?: boolean;
};

export const Button = (props: ButtonProps) => {
  return (
    <button style={{ backgroundColor: props.backgroundColor }}>
      {props.text}
    </button>
  );
};
