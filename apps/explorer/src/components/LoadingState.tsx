import { Column } from "@/components/Layout";
import { Text, SmallText } from "@/components/Typography";
import { styled, useTheme } from "@/styled-components";

export const LoadingState = () => {
  const theme = useTheme();

  return (
    <StyledPageContainer align="center" justify="center" gap={20}>
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
      <Column align="center" gap={8}>
        <Text fontSize={18} fontWeight={500} color={theme?.primary.text.normal}>
          Loading transaction...
        </Text>
        <SmallText color={theme?.primary.text.lowContrast} textAlign="center">
          Fetching transaction details from the blockchain
        </SmallText>
      </Column>
    </StyledPageContainer>
  );
};

const StyledPageContainer = styled(Column)`
  width: 100%;
  min-height: calc(100vh - 200px);
  padding: 40px 16px;

  @media (max-width: 767px) {
    padding: 20px 16px;
  }
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
`;

const Spinner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid ${({ theme }) => theme.secondary.background.normal};
  border-top-color: ${({ theme }) => theme.primary.text.normal};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
