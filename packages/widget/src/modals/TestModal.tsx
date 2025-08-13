import { createModal } from "@/components/Modal";

export const TestModal = createModal((modalProps) => {
  console.log("TestModal", modalProps);
  return <div>TestModal</div>;
});
