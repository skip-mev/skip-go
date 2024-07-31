import type { Meta, StoryObj } from '@storybook/react';
import { Modal, ModalProps } from '../components/Modal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { styled } from 'styled-components';

const Wrapper = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  z-index: 100;
`;

const renderModal = (props: ModalProps) => {
  const modal = useModal(NiceModal.create(Modal));
  return (
    <NiceModal.Provider>
      <button onClick={() => modal.show({ ...props })}>
        open {props.drawer ? 'drawer' : 'modal'}
      </button>
    </NiceModal.Provider>
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Modal',
  component: (props) => renderModal(props),
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<ModalProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Primary: Story = {
  args: {
    children: <Wrapper> Modal content</Wrapper>,
  },
};

export const Drawer: Story = {
  args: {
    children: <Wrapper> Drawer content</Wrapper>,
    drawer: true,
  },
};
