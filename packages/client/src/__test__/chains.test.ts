import { chains } from "../chains";

describe("chains", () => {
  it("excludes retired Lombard Ledger chains", () => {
    const chainIds = chains().map((chain) => chain.chainId);

    expect(chainIds).not.toContain("ledger-mainnet-1");
    expect(chainIds).not.toContain("ledger-testnet-1");
  });
});
