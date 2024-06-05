import { useMemo } from 'react';
import { formatShortDate } from '../../utils/intl';

interface Props {
  date: Date | string;
}

export const RenderDate = ({ date }: Props) => {
  const [left, right] = useMemo(() => {
    const $date = new Date(date);

    const left = formatShortDate($date);
    const right = $date.getFullYear();

    return [left, right];
  }, [date]);

  return (
    <>
      {left} <br /> {right}
    </>
  );
};
