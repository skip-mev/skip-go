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

export function getLocalStorageValue<T>(key: string, valueKey?: string): T | undefined {
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    try {
      const parsedValue = JSON.parse(storedValue);
      if (valueKey && parsedValue && typeof parsedValue === "object") {
        return parsedValue[valueKey];
      }
      return parsedValue;
    } catch (e) {
      console.warn(`Error parsing value from localStorage for key: ${key}`, e);
    }
  }
  return undefined;
}