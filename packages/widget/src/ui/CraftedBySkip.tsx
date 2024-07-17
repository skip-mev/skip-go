import { styled } from 'styled-components';
import SkipLogo from './Icon/SkipLogo';

export const CraftedBySkip = () => {
  return (
    <div className="w-full flex flex-row justify-center items-center space-x-0">
      <p className="text-sm">Crafted by</p>
      <a href="https://skip.build" target="_blank">
        <StyledSkipLogo width={80} height="100%" />
      </a>
    </div>
  );
};

const StyledSkipLogo = styled(SkipLogo)`
  fill: ${(props) => props.theme.textColor};
`;
