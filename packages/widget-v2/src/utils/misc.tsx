export const withBoundProps = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  boundProps: Partial<P>
) => {
  return (props: Partial<P>): React.ReactElement => {
    const combinedProps = {
      ...boundProps,
      ...props,
    } as P;
    return <WrappedComponent {...combinedProps} />;
  };
};
