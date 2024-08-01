import { PencilSquareIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import {
  StyledApproveButton,
  StyledBorderDiv,
  StyledCancelButton,
} from '../StyledComponents/Theme';
import { cn } from '../../utils/ui';
import { MdCheck, MdClose } from 'react-icons/md';
import { StyledThemedButton } from '../StyledComponents/Buttons';

export const PraxWalletIndex = ({
  praxWalletIndex,
  setPraxWalletIndex,
}: {
  praxWalletIndex: number;
  setPraxWalletIndex: (index: number) => void;
}) => {
  const [isEditing, setEditing] = useState(false);
  const [input, setInput] = useState(praxWalletIndex);

  const save = () => {
    setPraxWalletIndex(Number(input));
    setEditing(false);
  };

  return isEditing ? (
    <div className="flex items-center space-x-1 py-2 px-1">
      <StyledBorderDiv
        as="input"
        type="number"
        className={cn(`w-16 h-5.5 rounded-md border px-2 text-xs`)}
        value={Number(input)}
        onChange={(e) => {
          e.stopPropagation();
          if (Number(e.target.value) < 0) {
            setInput(0);
            return;
          }
          setInput(Number(e.target.value));
        }}
      />
      <StyledApproveButton
        as="button"
        className={cn(
          'flex w-7 items-center justify-center rounded-md border-2 text-sm text-white',
          'disabled:cursor-not-allowed'
        )}
        onClick={(e) => {
          e.stopPropagation();
          save();
        }}
      >
        <MdCheck className="size-4.5" />
      </StyledApproveButton>
      <StyledCancelButton
        className={cn(
          'flex w-7 items-center justify-center rounded-md border-2'
        )}
        onClick={(e) => {
          e.stopPropagation();
          setEditing(false);
        }}
      >
        <MdClose className="size-4.5" />
      </StyledCancelButton>
    </div>
  ) : (
    <StyledThemedButton
      className={cn(
        'flex items-center gap-2 rounded-lg p-1.5 px-2 transition-colors focus:-outline-offset-2'
      )}
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
    >
      <p>Address Index {praxWalletIndex}</p>
      <PencilSquareIcon className="h-4 w-4" />
    </StyledThemedButton>
  );
};
