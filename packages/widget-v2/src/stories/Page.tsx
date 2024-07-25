import {
  SwapWidgetWithoutProviders,
  SwapWidgetProvider,
} from '@skip-go/widget';

export const Page: React.FC = (props: any) => {
  return (
    <div>
      <div
        style={{
          width: '450px',
          height: '820px',
        }}
      >
        <SwapWidgetProvider>
          <SwapWidgetWithoutProviders {...props} />
        </SwapWidgetProvider>
      </div>
    </div>
  );
};
