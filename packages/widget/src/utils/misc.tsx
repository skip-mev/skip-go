export const withBoundProps = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  boundProps: Partial<P>,
) => {
  return (props: Partial<P>) => {
    const combinedProps = {
      ...boundProps,
      ...props,
    } as P;
    return <WrappedComponent {...combinedProps} />;
  };
};

export const copyToClipboard = (string?: string) => {
  if (string) {
    navigator.clipboard.writeText(string);
  }
};
