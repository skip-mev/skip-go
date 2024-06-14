import SkipLogo from './Icon/SkipLogo';

export const CraftedBySkip = () => {
  return (
    <div className="w-full flex flex-row justify-center items-center space-x-2">
      <p className="text-sm">Crafted by</p>
      <a href="https://skip.money" target="_blank">
        <SkipLogo width={80} height="100%" />
      </a>
    </div>
  );
};
