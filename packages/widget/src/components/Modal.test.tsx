import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Widget } from "@/widget/Widget";

test("loads and displays greeting", async () => {
  render(<Widget />);

  // ACT
  const selectAsset = await userEvent.click(screen.getByText("Select asset"));

  console.log(selectAsset);

  // ASSERT
  expect(screen.getByRole("heading")).toHaveTextContent("hello there");
  expect(screen.getByRole("button")).toBeDisabled();
});
