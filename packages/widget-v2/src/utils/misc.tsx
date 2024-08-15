// Define a generic type that infers the props of the wrapped component
export const withBoundProps = <T extends React.ComponentType<any>>(
  WrappedComponent: T,
  boundProps: Partial<React.ComponentProps<T>>
) => {
  return (props: Partial<React.ComponentProps<T>>) => {
    const combinedProps = {
      ...boundProps,
      ...props,
    } as React.ComponentProps<T>;
    return <WrappedComponent {...combinedProps} />;
  };
};
