import { useSwapWidget } from '../hooks/use-swap-widget';

export const WidgetButton = () => {
  const test = useSwapWidget();
  console.log(test);
  return (
    <div className="flex flex-col font-jost">
      <p className="text-blackA8 ">this component using tailwind</p>
      <p>test</p>
      <button className="bg-blue-700 text-yellow-500 font-bold">
        Hello world from tailwind
      </button>
    </div>
  );
};
