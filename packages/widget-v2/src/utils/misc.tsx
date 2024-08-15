// Define a generic type that infers the props of the wrapped component
export const withBoundProps = <T extends React.ComponentType<any>>(
  WrappedComponent: T,
  boundProps: React.ComponentProps<T>
) => {
  return (props: React.ComponentProps<T>) => (
    <WrappedComponent {...boundProps} {...props} />
  );
};
