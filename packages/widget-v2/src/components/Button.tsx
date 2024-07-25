export type ButtonProps = {
  test?: string;
};

export const Button = (props: ButtonProps) => {
  return <button>Test button {props.test}</button>;
};
