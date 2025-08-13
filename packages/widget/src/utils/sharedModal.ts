import NiceModal from "@ebay/nice-modal-react";

// Export the same NiceModal instance that both packages will use
export { NiceModal };

// Export a function to get the NiceModal instance
export const getSharedNiceModal = () => NiceModal;
