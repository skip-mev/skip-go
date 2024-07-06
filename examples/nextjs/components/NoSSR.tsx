import dynamic from 'next/dynamic';

export const NoSSR = dynamic(
  () => Promise.resolve((props: any) => <>{props.children}</>),
  {
    ssr: false,
  }
);
