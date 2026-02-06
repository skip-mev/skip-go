import { WalletType } from "graz";

export const okxWalletChainIdsInitialConnect = [
  "axelar-dojo-1",
  "celestia",
  "cosmoshub-4",
  "dydx-mainnet-1",
  "injective-1",
  "juno-1",
  "kava_2222-10",
  "osmosis-1",
  "stargaze-1",
];

export const keplrMainnetChainIdsInitialConnect = [
  "akashnet-2",
  "axelar-dojo-1",
  "celestia",
  "chihuahua-1",
  "columbus-5",
  "core-1",
  "cosmoshub-4",
  "crypto-org-chain-mainnet-1",
  "dydx-mainnet-1",
  "dymension_1100-1",
  "injective-1",
  "juno-1",
  "kava_2222-10",
  "kyve-1",
  "neutron-1",
  "noble-1",
  "osmosis-1",
  "passage-2",
  "phoenix-1",
  "pryzm-1",
  "quicksilver-2",
  "regen-1",
  "secret-4",
  "seda-1",
  "sentinelhub-2",
  "sommelier-3",
  "ssc-1",
  "stargaze-1",
  "stride-1",
  "umee-1",
];

// other wallets not the keplr wallet
export const walletMainnetChainIdsInitialConnect = [
  "cosmoshub-4",
  "injective-1",
  "pacific-1",
  "noble-1",
  "osmosis-1",
  "neutron-1",
  "pryzm-1",
  "axelar-dojo-1",
  "chihuahua-1",
];

export const walletConnectMainnetChainIdsInitialConnect = [
  "cosmoshub-4",
  "noble-1",
  "osmosis-1",
  "neutron-1",
  "pryzm-1",
  "axelar-dojo-1",
  "chihuahua-1",
];

export const keplrMainnetWithoutEthermintChainIdsInitialConnect = [
  "akashnet-2",
  "axelar-dojo-1",
  "celestia",
  "chihuahua-1",
  "columbus-5",
  "core-1",
  "cosmoshub-4",
  "crypto-org-chain-mainnet-1",
  "dydx-mainnet-1",
  "juno-1",
  "kava_2222-10",
  "kyve-1",
  "lava-mainnet-1",
  "neutron-1",
  "noble-1",
  "osmosis-1",
  "passage-2",
  "phoenix-1",
  "pryzm-1",
  "quicksilver-2",
  "regen-1",
  "secret-4",
  "seda-1",
  "sentinelhub-2",
  "sommelier-3",
  "ssc-1",
  "stargaze-1",
  "stride-1",
  "umee-1",
  "wormchain",
];

export const walletInfo: Record<
  string,
  {
    name: string;
    imgSrc: string;
    mobile?: boolean;
  }
> = {
  [WalletType.OKX]: {
    name: "OKX",
    imgSrc:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJDSURBVHgB7Zq9jtpAEMfHlhEgQLiioXEkoAGECwoKxMcTRHmC5E3IoyRPkPAEkI7unJYmTgEFTYwA8a3NTKScLnCHN6c9r1e3P2llWQy7M/s1Gv1twCP0ej37dDq9x+Zut1t3t9vZjDEHIiSRSPg4ZpDL5fxkMvn1cDh8m0wmfugfO53OoFQq/crn8wxfY9EymQyrVCqMfHvScZx1p9ls3pFxXBy/bKlUipGPrVbLuQqAfsCliq3zl0H84zwtjQrOw4Mt1W63P5LvBm2d+Xz+YzqdgkqUy+WgWCy+Mc/nc282m4FqLBYL+3g8fjDxenq72WxANZbLJeA13zDX67UDioL5ybXwafMYu64Ltn3bdDweQ5R97fd7GyhBQMipx4POeEDHIu2LfDdBIGGz+hJ9CQ1ABjoA2egAZPM6AgiCAEQhsi/C4jHyPA/6/f5NG3Ks2+3CYDC4aTccDrn6ojG54MnEvG00GoVmWLIRNZ7wTCwDHYBsdACy0QHIhiuRETxlICWpMMhGZHmqS8qH6JLyGegAZKMDkI0uKf8X4SWlaZo+Pp1bRrwlJU8ZKLIvUjKh0WiQ3sRUbNVq9c5Ebew7KEo2m/1p4jJ4qAmDaqDQBzj5XyiAT4VCQezJigAU+IDU+z8vJFnGWeC+bKQV/5VZ71FV6L7PA3gg3tXrdQ+DgLhC+75Wq3no69P3MC0NFQpx2lL04Ql9gHK1bRDjsSBIvScBnDTk1WrlGIZBorIDEYJj+rhdgnQ67VmWRe0zlplXl81vcyEt0rSoYDUAAAAASUVORK5CYII=",
  },
  [WalletType.KEPLR]: {
    name: "Keplr",
    imgSrc:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAQAElEQVR4AeydTYwexZmAqz8bEgg7M4DtQKTwI+8hqwUFiLSRAGntHLICDhlnL+xll1zwZSFG2uSyrGyk5BIOQDglF0gu8YmZHALaHDJZyV5pDwEke1ccQHHslcjiMfYQ2/yNp/d9qru6q7qrqqt/vgFWO/qqq+qt96/e962frv6+npma518Gc32hEE1LK2/ftmvl7L7dK+uPSH5I0pEbV995gbRr5Z2VXStn10jS/vtm2vXS+nlpy6v00tmqvHulLlftk8DWzzf12L3yzmsiQ+tJju4kKR+RdGjPyvqy5PuWpK8tY3SZqau9xdAFhMjHB0CIM/Lz6kJBp9tWzi9hiN0rZ58RY6zsXln/veT5TrXz94Kwlqv8BcmfkXQ4y7NHSEply0qpfUqStN/WTCrLl6St/mR1Ma+LySWLPEKTL+Uqb+iS3SUE+zLRU+eV/uqw1J/ZUvmK5Gv0lT6LDV6TRHAf2fPS+vJtYhtp93+SOyLSPRxC5OMDIMTZUkI6u0/SYUlrF9XmeQwhZIcEZTkXI0r+qfqIbqP0adO3IQgQ6F2SCO7D2ATbSEAQFM/sXnmHYAKtZxKOqRQSK+MDICCMaBaHM5WvCQrpiOSMYsmGfEIdC8GHyOhPIzZMIErDgpH0hqA4lKtMAmFdlruzjwCfS8qVmjwASscfvqiuMKUzlY9wut3tzK5Y5RDcQpljUWw4N+65zI7C/4VymWQZCcoaaoVJA2DPyv8sX1JXXhMtjyiVu+uyAP//M8wCuQSCUB4hEGRp8M4IuSD0/2TTzAA3rZxnB7+2pWYrpbLqM/uXNzRv1hvN/uogIj+rCiqWlUDIVfaCLK0r2LxqGlzIxwfA7l+e++5mMerbU30+WLO5Ekany2Zjs25r1uqfAcSIbAZ9ypnKavTlTbUpe4R3vLNBjRYumZbBS0C51j+Tb209G5zuLY2NwE88Fx/JJ66GQTB5CJv+OTgAQsjj4Y4opZZymQ12y+205jxQ9GwIHdPPJbXJzp5bOS1//CUfz8LHocm2s8NCYHBM7uNrYCk4BjeUi0inqVl3Gk2lQJLrIQmC12566fxtpqVPPhMGffAVzr+irqwJ3cD71JC4KSzp4d2LbS7TrI8g9zCeENQQmTXqfkk1kmh3Fz7BN37cMLTXEoAABMl2ZFC0hdVIbJGeJmJ2otXms1Ez5RdRY9clm65H2S/AYZCA4uBTwSf4Bh9RT0rSmeQAgDECEJTEfGKkDKuIwlOxhd0QXkPpKlkT9qHiWRbwDT7CVyUonklnkgIAhjBGgI/jHPtUi9sWIbW4oaVPWk18hK/wWUofkgLgitqM3t9LIKXIGoVjy/jytTN1x+JO9dDNV6u/u+Xz6ntfuVb94M4vqB/fc5362dcX1Or9i2pt/5J69Zs3VOmth25UZ5d3+dO3XDi4Ni38TEIGspB5cO816kHR4b5dV6nFqwrX23qO6vAI4iIINle4U+tiM+tCkEOHZ6RTE2/4SqnCWAVWXTC+fG2mHYzBMTxOMc7BwS+Ks4F/XwIAZxAMxiEECIFi0kLpIPi2UuG7CgyuoSPHwSYhA1nIRC8TcG+WAYZewAiQB790tbpFgrVivI0FMe1dcqd2uCmyWbcCoGEFwdy9og8aJrzVE6b2R4vUFw3F2BgXpxaOvlGPamAYnnaco5E/pRcCjyAkQH72Vwvqd+UsRFA8LLPVdgaEBIE8jPtj1H9WAAi6ZVTWkFzt4GGOBZ2+uHjVTDFamGIZ4YwqnL0QG7HTqzFXjgQuQfG8LFEEBLNEMBhcN0yg147D+DLEyAoAF2Uz2xTnb417oBPpDFMqTn/zoRsUo4W6q8FnuRbpuHSLWcIEA7nT93pCFMzi4wEVDWnXJTk25ks2XmxvAOipP1fLqudfS9EWQCk6i+NJlHuK+OTQ4z5t6OXpeAPDVJkJsAUptDz0Eq0Ztyj27VlZ9/rTGwBKzTo3D1pO49ISa7WzS2Z6p6OfKcebPmSmMJ8cm7A8YKNFWRbHSWkrK755xr0rKHBaAbDrl+cOcxsxTgGX+k65ZVvbf71iM+e29KxJL3pSfObQsdGa3MKGZoOhHcKnF7c+tDaEhTFbAZBt5aMfMdpKPnzL5/R9ORshGz6oXATtINLPEhG2YjbAdpPqPdvxXT0LWHZ0AmC33PYRKUaohWdAvfKDez+vnr/nz9TCtu3o8176fdqRsd2jctg0hZ4lj6WLavMR++jFCQDVWPvHmJPo/cGd15Vy55B5lcvmIKhgeebyljq5salefvsj9YvTH6ijkshJx9c/VqSNj71KFQwGXn8oJ5zYciC5j+xbNrAKABn9d9mj30bqW2b9Inr70vXCn5+vtaN/8tb76vFXL6r9axfU3l+9q+759bu6/A//8Z6GPyZttJOWj20o0p//6pzgntNl6AmYXn0KIDOQuHX0N/cOOr6iX317qwqALTWbZO1nt796/7jjA39HE6B5Ao4HhZF7XEYxztwrTsTpT564pEc6Tnzvoy2XKiLnPZkF4AU9fAgcZovTMoO4TNJr2PTncuy96L07GDAStrbaASBPwv86XaUwJqd6bGKUvdCE0adt6WkLHIXTcRIjmOkcB7aUavJt1lsENYClg9li+dgF9fQbl1V6ILhRhk2/95VrasZjSrNZ5esZfJaKnySNfuDD1H+w2rT0sBJKbFNitOMIRueyTN1Bp0+sD4HwIwmAZQkEZgTN3vWxBtXjpmE/wcW2nBcUiKOu+/TdgLDQAbBDXdlXCRZBAh/0+bHs+AcReohGqOHhppRxPKMdRzC1exHnDCQQmBFYIlTDx1q0D0ZDCWeGnWJ2vYzPha8OAJn+69FfCpK2Xh8ik9SLKII8UI0Wx6bjnSneRJnJW9TzA7BJZBZKXxIKXbDxfbuuLiojrnle7AN0AAifr3qjURpSPxPfqiSI7fYaU60Z8Y7jDXcTZSY38BbrBqBRNWR9c2YhloSNj7d6kRazQBpJCCvPcv29ThMAulIj53UxocTa//CXP5+AWaD0417QtK9Nr9UYJ+R+fVnWd6Zar+NrVH+pxboBaFT9TJpQf69ZEpaPvSdLVCwIXFpmAf8dQVNmuJ6pHV9V8mcCoF4CBKjs6cCVrXx/9zIl9TBKD1SfuCiMDd435N6dHX4UccrGBBsp26bK/WMmePqN912gU2tb7FE5ZXVQykobs2xoZObMZ3aT720VIJtOJXA8uPdzUBTJ0BW1uV1tMdIZfXvFmsoGL01oyUFn+pJG5sNKsJGPzIaxJ+CU0YbFyvftusrbbPekS60l8f1sU+1sTP8l3y7qEo3p/45FS5lEupJ8cGaL+elbH8op3Xl9gpfOsOSgM31JJ50T5pMnLnYsBbVgAoCzgRrSLtnB0G5Vaqf4fparTI7tcl97Euxepv8kzGmR0HhDTt0ee/VPCsMNWuunVanmhnJ1LbnEfuCnb32QjP/AzdbMm0xVI2Yqu20mt4AyA2Qq+hfp0AM3W6M/ymSqxkIZjMVG7+jpDwcyLvgMJI6TdZizTSy6yAc4S8FG4l3BHYs7IBmcZOlcmgm1zAByjX0iHbrTTP90gBTjI20JKIIV+2Sq2OVfSJjyY9IinYqJr07Mokg9G0UX+UC0IbNaalA/OHIGEHlL5QwgxR6fUlf9nfdqHQJI6uCTgBLl8Io8jmXkMwNEEXVjU1osIDRBwqXJM4GkA6XJkT52kOjmxasyVdlfQ+pLymlhnmW3MgPYVE65qZhpNGa8Y3GnAW1Lzsj4e3kcO3y9D/UoUX06TkpET0VrsuQWNi3A+ZLt1QExaX1lE3hrgINqKtbE+8ttDABu79jwNXUYUj8o99A/vuc6/aMTkz9aPcSKcMSmpABKpKlF0YX78ttpe5thg7DwbJZfuT46A7S0bgDYhBSsGg0TV3H+0/IkrYttl1ENPbtnfnzSTLSn8gC3meK2cFvrmimZvOB6cuNKUXCuLg5NC4P24KaXs8VRAXDLtTuC51ttVVG3f2La9znfdMHm2CmzREBvm44y6yl5XuJQnjb5NEaCgZscmFLH1z8qCs7VxaHp/uBteFpHCIDuuwAkeVJs+mmr6mHQAXpFNnz2tG/ztLtnw6MsS0TfxqmClThRPtvQyB5gQ98O2j1tC16QjWAbCqS7I1lxDpANCgAzYhA1j8St3j/KIY/N22sKAcrHRouWY3pXQRDlsH2N732MrIyLJxW9pj+pevs4MQN4mHeD5rkB5Bk5X75M2u37ehVRPzZrLXq/cxdh1tVU+KgLK9h++rJvH2DQ646n6S3HPobU2t4PDoCl4NRTSRlU2JCDkOVjF9SZEV+ijAlmxITaY8ERorHhtUtKaAtQwhOzM9EAqJnYe5oa2izZylAuonNwABTTTsGkKWpMnQ3fvJyPXrGZa2FkUKdbIx0TnbsSeuPSJp4PVuMUrXIOkA/aAyzo6bJgUjOllHOJphDGT+RBCGfhLeIQQQuxG8CtawirbptQoFeYaze35iWIAhmMPo19MJuRLApLM1kOBgXAYnC0dHfHh3Fapnye6tkKVuUGQaNaofkKTdzYdFk91wje3PokjIf5HZUn/6RuUQ/GQXpIADQtlMgnHACJDCTyDCYGYN039a4c/C4c027jovMdC+Hja2aAEcY0InvlYfNnKlWXhUGHQYWaI/YAOwoOA6+5Ncrmve4bFTkBtMQasJM/cPPVTt2t5G51ZA3nxzgSsCkiFofPAOPfFl4paPfELlcIboHOA2HqJwAoT5IislO+uRzHMVpPoqk1B/r5sbb7WwqorOG6kBooGrlxGTwDNPgoZ2T1sFOfqV+l/AVkPygj+77A9+hstuCQbFhaORJ5aQwcLJzaNbKz0uhdeA7jRmVwADibqYF9P3r6g7nd79v9vOXameIXtinPyKHjl839jZpBOix57OeeSXgQLEkEi1VNLwpb7gLKOEqna2EO6DsHPjzla/EaC5BO2SwwDu/o46WTKrGnTL2r9y8kb8LU2D+P/diQ1mw9CHXj8JKwnWGThs2GM+ykrCVxvz+XAx/plFED56/ev6hfK6voqEr/YwSuShDcKrOHS1X3wYXXNUuFGtizdG/CctWTpRd95oV2bk+U3KP6KePQwjRs/Jj+47jjWlnH1/ZfXzp/GC+CYOX+JcWr3GoOWWcoESJZTTCoVJ9JdJMvBM9kumkDAdCt/uKIWw+cP4/Rj8P43dza/iX3xVR4xGeLENzCZTl4/p7r9EunD+69RgdUAllrCHVbtBbKngW5GpIgjJlO4w64tAMgQeAAORUJaz8BUAESC3QSo+BkdvR8m4d36vGVLhzOu4XJeesoOA7bkPVDcIe4qCAbecg4u7xLBxh7CwKOwEAnZh3w0LWgqq8pZjXq3Gt/yaMEptDX0rpLJVvPOYBpsXlMKP2Vtz+0dv5hxsbYvD8Yg7/50I16FOIADI/jMTyBgMMXRkyDdldTy/fJGo3TCTh0RadV2W+gL7qiM2VgtKfwNdbwnUX43JLCM4RjZLVn5IoyTwAAEABJREFUAB9FQLph4iMJwdydf4CxEONUEiNKqp/Mx+5gVa4KnTqhO4FCP2zkcK+V/qo9NDb+vMrokRYAAQ1gEGjygo+vb1qj34syZ2C687QidgerclXQKD05dtLca0//Gjt+elGi9MpMD9A9EgA0+/iG4CVupFmv/ZH2ksMcM7vr04gxHKfhptTBve33LEwtw3ZBJABCYkPw0gSRZr7k2XkPVbIJZ7b6Yax4S0TJOGGwdQqtOPxpLhdBgRM1RAIgXUJK519++6Pknz4j+eTGpjq+/rFnyZjeecgbm3xacatLP0gp/A/KbWYK3pQ4kwSAr/NNJfXobwLteiOKnjxxSS0f29Bv6Ny9uq7fwMn7foDxhVHa2VASWARKhJXdNEmZW1mcyivmONF8/NWLCp14QcU9//qu1hWd0RcYunoF5zWUe3/3wMla+y28miJcSvGHoZ4kAAyzWH68+UOHZqe01k1gzZFvCDOijsusgNMxPI+RMTxBgcGNscGrKacp4XDkIYNXwpLjeJzL3gadwDnz/pZCV90dr2irjxbSP33l2hZ21VwVWiheQCWhKnjRNLAKgJ4yek7nV9pTuSMQTUkCJNOq9b/gAALja79+V/GCKI6c+3NxKeBBgOFwZhxkuBjWSLUawt2QPlp4FBn9nGdQHpKYkbx0bVEttCoAwgq3aDSg+NGCLnZeGLVxJDQlCVaZSWnUh1G5fCzlHQJhMfw4Zf/aeb0XCWONb+E0cQwXZpyh9FUADGXg0vnD6N9l2o761U/msh5QYylYln2Eb9R2scP50I4xbpcM2hn9zbUfeFeaql0HQNQ5vST5OZ2+fKX1cMRh6ydzUIZWmB5xJFN5Kg9w2Vt0OX8KtceO/tQ+hfB0AAwZgBv6h4shti58yAh0OQRqiYpvfJyrxxu/Mwxw1OB/OXGxvWfRLe4lUbxLZNV4uaY9+ofyY4BZbHsVdQD0oiiRMWpZtLJ2F85c3rLaJy72GILsQ0hdGoDDjr4LL9buqtW2CbQ8Mfz+X7R3/rRtZxoRAD7Hul2nI6dl+iePrwEaY+6XowlvFEvB6VLUdXnbJtBz6MPDIsom+TFN63zywQHQtT621O3snW22otxJ0hISAhT8XpFH0SEMA+88sDKIIyL6PnmUPOXaXw2ySrf0QjwACrt5ufmXgDZqunK2u4tyJb4qtPmnQQp+6Bzbj5zcuNLjfKPgmSa/xmLX/3zk/yoM6Wp1Sx4jDrQRABdq9RqlSB8xZgM7WI2wCdI4DZpBoAcOYnflpDxjCGGlB2uIQzeckd+c+m0q3VUbkFDeMBtym7hpLrut5nlhlqksHAA1Yqt0psfmrqlLi1kSIEvC6kKKBQD3/l306e3tXvPtIXvXb/NqY7ch4PvShtzltOAJ5srE98wALdoUwJ9M1KUgD8TJGnTNeqPZqYZwN/RrVxzUqvJfsgRUldEFV4M7F3cqRn+IrYsNVhsC1Jf+u8dgbNI3AiA96v5gdvdNjlYdbgsjvj0MvcWu17arSWv4nIxEwMacgpp1n+8MGh2mzsfo3QiA9Kjb8E07jZ7B7dZrU39FHHJZg2lZhXdZ7JXF9D7Zewbo1hnnr96/FHmlay/1vcj99a7ZNAKgbugqsQfYSBgxoQ1P24FtSEyHbtP7qdHb38J/FvOdbYSwgcd1XrwqU4z8kA3gMEXq9oOxlsmN1PzCLFf5KVPtm1e3HxFCjLAoy0DTVHlJ04SX4LlmviDwwVCi0s8oDDAxcbs37694pY1+0wuTFx2QLl0YPAPA4njzSx4APYmDDxHmafE/S/ciWsAsxKzCiSO4I6bAPW3vaQqQ5lYVXdvpttgF5z9wU+xlEzHq9DZH73SyCpMAGHQbCIeNhH0AeNP+0FHmrE5nxBGOnv5A/19gvtL1Czke/oXUnRPAJnkVBfSmO+F8/eOOJp9u0t4YJyPnGinM5Bwg30hB9OGcTNw0MQP46PvAsCVJjf9aseLfsvB1LjvxTSIV+isEh1orOMtd5fwKOk1Bc/EE4n8m+kDTNy55lp1iBlDBP49AGzd1CZji686oQrLlDy1PxceWj/P5GdjDtwyd9hO08gTiichtra1fqCybwCy8CcxCZAX8jBxAbCTcCYAdf/kSGBOkBBt2S+nJRNC51VurforeYbSgAv3p+OIKPgiy7GjI8vwPzACD9wDwd9ZOAIHE40/uBgLNDbBYtQFJqva3oYdtPyb37b5Krc75Pt+jpAad7Fj/s+6jswuyB8hGBUCXElpTuTBFPrr384kreCYUn/7PQekP037/+/yBAd4wSdfgyzusPVPZKVkC8vASoLr/Xn7b948N/HQH916jFjxnAhV2XpZMXla3NUuQvSgHPD//+kL54qkh2k0T4McTb8NDGm4pOQjaqTZHBQBr0PH1yBMWSzqG43f9QRsbu5jcom0Xg1zaqH0gHbK5o2G9T9rTeFV0gW4tXdGTsvvH9k2KDvUd9E3x/eyPB24eFQBw5Gvf5CmJlyo8KjNBCm4cp09X45zcVr9LCF5e9NBryveq6ALdmqtJrBa6bfVr7+d0QXw/oymTtYDcST04hZRx+FkVnov7jkgzgyOyq7KB9c6FSQeNX0YbakY9S1gHy7TmbtUqPqHC8YHTv+md5K/DWweAnK3pCoAqCUZV7ihsyIng8cRlAFaMJkYSt0/UTarsIrKrsmnsnQuTDpouGeiHnqT+G72I8G7VIsRKcZLpm/6jRGWj6XOutv4AqAyATFcAxJMhb2Pxw8k2NAwpgmBJv3UrjDVxS1h9RxC68eWN333zBsXodxo/BZWjcnyNGn3iqI0704N+BiNJv5WU8GmzMUTMAKTuW09DofQz8rX9S2qaPUHNN1TKwuprEuN4Xu7EMqWBXRcTVCbvwh/Zjo1JsGmLbEPAIzVbZiqrA+CK2pEYALAKJz0LZL72pngX54d3fkE9f891+gVJbsu0tZAWjHLkv/o3NygcvyC3ecmSTX9Nnkw4DPGx6C+c0pW4tvT5DDUuHLiew6DRQUBk/vSt92HZSN2K8WXJ38hxKlMva69mEPKYbhx3YbSzqWN9JyF/YWe3nsOlJnYmgsa/1HHX/ghyRFHp5eunCp877wn8twhNchO/oeeMOpnAQsQpjMBVOVplRN6xZP13j2F9tbgXS45xOu/y47aO0e8gza0iZk/hHUDDpj9641KDQwC5gaWrtv3yvPK1ngE0glIJM4DNRVV/thrcEfDL2o3QQyI/i4oXBXbcjEj2B6zHBMODX7o6vmFs8F2UE0eci8M5fIIPKeb0BgtU6ZdGMwiLWz52Qb95JIwRFq79oy8ldaZeVOVfFQDrB3YTAKSyyZfZXOr2puiT8pDiyROX/Qh+FjVuo2SCge/WERBnl3cpcqZtYDhXp69dJw9lFvXbRHlt7JsP3aDrOJy3b8CnwbpV7alai77j6L2NH4HYTaz77tRvtxblLCLc9o88IDp19sAevQGEsgoAKpJ+OexLWkLZ+Bw9/YHi/TkanOlrlLWtZIkdzDhEYnRzqohzTQKGoxf6bOIaUvro0SCdSxUbHi1v+2ICeuj9lM3HCYBNtVOmhowNoY0zuMwJ4WOvXqzps7rYLHmbevSqyS+lPmf2KSoEcTbkcI2Rjw2DSEkNdS/L0S8+rgmdACjvBp6rm8eXjspMwOvS2MT05mZHRd2P3mxCBDZ7g+ODmTadp+qRiqeZuhdstXxsQ078PnQbBtXqHuVb+c+aLJwAoFFmgWeJFMp2qtnY0LQy69c31s4r/y1iGo/IEpfIYCK0BENo33fhaSR9cRTjVo8XU7GPchpGVvDp+t9+8UiTTSsAmAW21OyJJmLeBPSsM6X984lL+sWPx3s8N+gp5lOB3uV7raRG0hdd5Ykqo/7JExfL3f5Yi2u29sVZ+01DKwBoOHdg16rkHXcEgjHgw2xAR0ksD34Wk3feL2YUdBodGQzY4lsy5VOuj9Lr4BilZsFwVXb+ztpveM5CU+tOtfkdQZpsQyi8nA+dZYPI/oD85HubVjudn8bAFtOJi+g4jCV9f/qNy/qVsjifesWpD9skE2UXxJetGd3I0/82zlTsvPyiiHfasPE6yx1Knrm0JZudD9Q3fnNBLw8EA18zO325g7BTcH+EoRK76Fj++PHJk+USiNM5Mf2T7PSbWqbXRWpCsMja/0TpSy/rmQNtMJTDoWdzlY27K2jwdORRKdtzKbM8sCxwksjrXpkdKGMsgmLqjZGIdD6lKg4spWLocDR9wNncvj0ut8D0gXcLUwZGu+FJn025V64JjVQPpW5XMrnnz4WmflX+uQFQEpZtOruidrBzrE6ONFAuEfHSOs0HY+F4pksCgff18lLovb86p98kDoxRRYBgXAzPdGoS9CbhnFStwDV05AQePNEFGchCJk5FB/QyjiYHjl7gQp8qNxmvy/jSLiP/dXH+oS6ebgB4sLkrkDXkgDB0vjvoiRWJOA+DOYB4Q5lxCM4gQDA4hmd6NQlnmMQoJHhSEriGjhwHwxNnIwNZyMTBBAUBMhdHD7QdvtqhrhxIIe8MAJiwhgjD/TCmHkq+oAjh9oOP4ywDop+4zzA2PsJX+CylG0kBACMYwhgBbYOOcxD846ktMY7vts5bO1fa0Np4LfENPsJXqVokBwAMYYwAearjLAdq2yZ/JX/9DDUudETctn3imsZblXggP4Vv8JHq8dcrAOCLAARJubUxFNg2fHymCAdFuGUbVB0tota+LrWZysh/fUd+ZT++abfGIb0DAHYIklvEu/Oxt4gwmyS5QVHV8kmYbwsTv5CqJ/5mgWZ5/twX1KX9f/x21w98/LwGBYDI1R85Mj4k0TfXE0MtqOel8nujz41qT64ToVfKjebHKe0TZ7+959CpA7dT7mDoFzwqAJAo95ovym3i3bII8fwAUDv5Zbfx5gzpVKOBMJeAmYbpb7G5zMLPjjWZJwBKDcssRYBeEpZ3y31n/h2ZERobROHQg5dg9/5Mxr7BqBEPvfWamgDbztTWAXH8oPXep48nAMpul5mPKARbP7DnRZkRbpf2p1BW8m35DFBVJqxtUc0V0kPRRiwyxT8la/3d7xz4YnimdaUFazZvTwAE6ZIbJEKPEAgSBO6M0MMAycIGIn4iqtiW79C71I9H8k9cpy7ejk3T1voOxtJc8paSUrN5DgUJAj0jSCDcLek5keXeOtqaaHX+b16yft3C6TyF3S9OJz2b7Pg+gkrcWfF9gX4a9sWWQNAPJqRDd0s0X5+rTPYL6ikJP6YzNygq5nlVihaiaNFGzba0gy73vaTShrTIVHZKZWqVwZGLTbCN2AinH5GcQFC9/vIe2CXurAfJJKhE87kDu1alg0fWZeO4/u3dd0s521Sb7B3252IIEfSEUtlTeZa/SFLFj1YwCOn1TAxXpSw7Je2skWJLKTmfzKlRaUJygH1STSAys1OZrYuUhRU6/laUWUV3ksAY0U8ILrfM++nr+oE92dkDu27HBmcP7Dl0TmyCbfWWwxQAAAAQSURBVAS3xycL4npbPMD/BQAA//898VyDAAAABklEQVQDAInyihPVoQR+AAAAAElFTkSuQmCC",
  },
  [WalletType.LEAP]: {
    name: "Leap",
    imgSrc:
      "https://raw.githubusercontent.com/skip-mev/skip-go/refs/heads/main/assets/wallet-icon-leap.png",
  },
  [WalletType.COSMOSTATION]: {
    name: "Cosmostation",
    imgSrc:
      "https://raw.githubusercontent.com/skip-mev/skip-go/refs/heads/main/assets/wallet-icon-cosmostation.png",
  },
  [WalletType.VECTIS]: {
    name: "Vectis",
    imgSrc:
      "https://raw.githubusercontent.com/skip-mev/skip-go/refs/heads/main/assets/wallet-icon-vectis.svg",
  },
  [WalletType.STATION]: {
    name: "Station",
    imgSrc:
      "https://raw.githubusercontent.com/skip-mev/skip-go/refs/heads/main/assets/wallet-icon-station.svg",
  },
  [WalletType.XDEFI]: {
    name: "XDefi",
    imgSrc:
      "https://raw.githubusercontent.com/skip-mev/skip-go/refs/heads/main/assets/wallet-icon-xdefi.jpeg",
  },
  [WalletType.METAMASK_SNAP_LEAP]: {
    name: "Metamask Snap Leap",
    imgSrc:
      "https://raw.githubusercontent.com/skip-mev/skip-go/refs/heads/main/assets/wallet-icon-metamask.png",
  },
  [WalletType.METAMASK_SNAP_COSMOS]: {
    name: "Metamask Snap Cosmos",
    imgSrc:
      "https://raw.githubusercontent.com/skip-mev/skip-go/refs/heads/main/assets/wallet-icon-metamask.png",
  },
  [WalletType.WALLETCONNECT]: {
    name: "WalletConnect",
    imgSrc:
      "https://raw.githubusercontent.com/skip-mev/skip-go/refs/heads/main/assets/wallet-icon-walletconnect.png",
  },
  [WalletType.WC_KEPLR_MOBILE]: {
    name: "Keplr Mobile",
    imgSrc:
      "https://raw.githubusercontent.com/skip-mev/skip-go/refs/heads/main/assets/wallet-icon-keplr.png",
    mobile: true,
  },
  [WalletType.WC_LEAP_MOBILE]: {
    name: "Leap Mobile",
    imgSrc:
      "https://raw.githubusercontent.com/skip-mev/skip-go/refs/heads/main/assets/wallet-icon-leap.png",
    mobile: true,
  },
  [WalletType.WC_COSMOSTATION_MOBILE]: {
    name: "Cosmostation Mobile",
    imgSrc:
      "https://raw.githubusercontent.com/skip-mev/skip-go/refs/heads/main/assets/wallet-icon-cosmostation.png",
    mobile: true,
  },
  [WalletType.COSMIFRAME]: {
    name: "DAO DAO",
    imgSrc:
      "https://raw.githubusercontent.com/skip-mev/skip-go/refs/heads/main/assets/wallet-icon-daodao.png",
  },
  [WalletType.COMPASS]: {
    name: "Compass",
    imgSrc:
      "https://raw.githubusercontent.com/skip-mev/skip-go/refs/heads/main/assets/wallet-icon-compass.png",
  },
};

export const getCosmosWalletInfo = (walletType: WalletType) => {
  return walletInfo[walletType];
};
