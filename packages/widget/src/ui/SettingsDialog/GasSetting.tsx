import { BigNumber } from 'bignumber.js';
import { useSettingsStore } from '../../store/settings';
import {
  formatNumberWithCommas,
  formatNumberWithoutCommas,
} from '../../utils/number';
import { StyledThemedDiv } from '../StyledComponents/Theme';

export const GasSetting = () => {
  const currentValue = useSettingsStore((state) => state.customGasAmount);

  return (
    <div className="flex items-center space-x-2 p-2">
      <h3>Gas Amount</h3>
      <div className="flex-grow" />
      <div className="flex w-full max-w-32 flex-col items-stretch gap-1">
        <div className="relative text-sm">
          <StyledThemedDiv
            as="input"
            className="w-full rounded-lg border px-2 py-1 text-end tabular-nums transition"
            type="text"
            inputMode="numeric"
            value={formatNumberWithCommas(currentValue)}
            min={0}
            onChange={(event) => {
              let latest = formatNumberWithoutCommas(event.target.value);
              latest = latest.replace(/^[0]{2,}/, '0'); // Remove leading zeros
              latest = latest.replace(/[^\d,]/g, ''); // Remove non-numeric and non-decimal characters
              latest = latest.replace(/[,]{2,}/g, ','); // Remove multiple commas

              const value = Math.max(0, +latest);
              useSettingsStore.setState({ customGasAmount: value.toString() });
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.currentTarget.select();
                return;
              }

              let value = BigNumber(
                formatNumberWithoutCommas(event.currentTarget.value) || '0'
              );

              if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault();
                if (event.key === 'ArrowUp') {
                  if (event.shiftKey) {
                    value = value.plus(1_000);
                  } else {
                    value = value.plus(1);
                  }
                }
                if (event.key === 'ArrowDown') {
                  if (event.shiftKey) {
                    value = value.minus(1_000);
                  } else {
                    value = value.minus(1);
                  }
                }
                if (value.isNegative()) {
                  value = BigNumber(0);
                }
                useSettingsStore.setState({
                  customGasAmount: value.toString(),
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
