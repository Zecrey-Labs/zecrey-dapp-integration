import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "../styles/Home.module.css";
import {
  getAccountIndexByName,
  getLpByAccount,
  getPairRatio,
} from "@zecrey/zecrey-client-core";

const ConnectedL2 = (props: { accountName: string }) => {
  const [accountIndex, setAccountIndex] = useState(0);

  useEffect(() => {
    let _isMounted = true;
    getAccountIndexByName(props.accountName)
      .then((res) => {
        if (_isMounted) setAccountIndex(res);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      _isMounted = false;
    };
  }, [props.accountName]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3 style={{ margin: 0 }}>
          Wallet address: <code>{props.accountName}</code>
        </h3>
        <div className="columns">
          <Transfer accountName={props.accountName} />
          <Withdraw accountName={props.accountName} />
        </div>
        <div className="columns">
          <AddLiquidity
            accountName={props.accountName}
            accountIndex={accountIndex}
          />
          <RemoveLiquidity
            accountName={props.accountName}
            accountIndex={accountIndex}
          />
        </div>
        <div className="columns">
          <Swap accountName={props.accountName} accountIndex={accountIndex} />
        </div>
      </main>
    </div>
  );
};
export default ConnectedL2;

const Transfer = (props: { accountName: string }) => {
  const [to, setTo] = useState("gavin");
  const [value, setValue] = useState("0.0001");
  const [loading, setLoading] = useState(false);
  const disabled = useMemo(() => {
    return !to || !value || loading;
  }, [to, value, loading]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const zecrey = (window as any).zecrey;
    if (zecrey) {
      try {
        setLoading(true);
        let val = await zecrey.request({
          method: "zecrey_L2_sendTransaction",
          params: {
            action: 4, // transfer
            from: props.accountName, // zecrey account name
            gasFeeAssetId: 0,
            args: {
              assetId: 0,
              payees: [{ address: to, amount: value }],
              memo: "",
            },
          },
        });
        console.log(val);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      window.open(
        "https://chrome.google.com/webstore/detail/zecrey/ojbpcbinjmochkhelkflddfnmcceomdi"
      );
    }
  };

  return (
    <form onSubmit={submit}>
      <h2 className={styles.title}>Transfer REY</h2>
      <label>To</label>
      <div>
        <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <label>Amount</label>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <br />
      <input
        type="submit"
        disabled={disabled}
        value={loading ? "Transfer..." : "Transfer"}
      />
    </form>
  );
};

const Unlock = (props: { accountName: string }) => {
  const [to, setTo] = useState("gavin");
  const [value, setValue] = useState("0.0001");
  const [loading, setLoading] = useState(false);
  const disabled = useMemo(() => {
    return !to || !value || loading;
  }, [to, value, loading]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const zecrey = (window as any).zecrey;
    if (zecrey) {
      try {
        setLoading(true);
        let val = await zecrey.request({
          method: "zecrey_L2_sendTransaction",
          params: {
            action: 3, // unlock
            from: props.accountName, // zecrey account name
            gasFeeAssetId: 1,
            args: {
              assetId: 0,
              chainId: 0,
              amount: 0.0001,
            },
          },
        });
        console.log(val);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      window.open(
        "https://chrome.google.com/webstore/detail/zecrey/ojbpcbinjmochkhelkflddfnmcceomdi"
      );
    }
  };

  return (
    <form onSubmit={submit}>
      <h2 className={styles.title}>Transfer REY</h2>
      <label>To</label>
      <div>
        <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <label>Amount</label>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <br />
      <input
        type="submit"
        disabled={disabled}
        value={loading ? "Unlock..." : "Unlock"}
      />
    </form>
  );
};

const Withdraw = (props: { accountName: string }) => {
  const [to, setTo] = useState("0xD9ec5DAABd83dD452445f4bCA909aaeA335A9F38");
  const [value, setValue] = useState("0.0001");
  const [loading, setLoading] = useState(false);
  const disabled = useMemo(() => {
    return !to || !value || loading;
  }, [to, value, loading]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const zecrey = (window as any).zecrey;
    if (zecrey) {
      try {
        setLoading(true);
        let val = await zecrey.request({
          method: "zecrey_L2_sendTransaction",
          params: {
            action: 8, // withdraw
            from: props.accountName, // zecrey account name
            gasFeeAssetId: 0,
            args: {
              assetId: 0,
              chainId: 0,
              targetAddress: to,
              amount: Number(value),
            },
          },
        });
        console.log(val);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      window.open(
        "https://chrome.google.com/webstore/detail/zecrey/ojbpcbinjmochkhelkflddfnmcceomdi"
      );
    }
  };

  return (
    <form onSubmit={submit}>
      <h2 className={styles.title}>Withdraw REY</h2>
      <label>To</label>
      <div>
        <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <label>Amount</label>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <br />
      <p>Asset pay for gas: REY</p>
      <input
        type="submit"
        disabled={disabled}
        value={loading ? "Unlock..." : "Unlock"}
      />
    </form>
  );
};

const AddLiquidity = (props: { accountName: string; accountIndex: number }) => {
  const [value1, setValue1] = useState("0.1");
  const [value2, setValue2] = useState("0.0039");
  const [loading, setLoading] = useState(false);
  const disabled = useMemo(() => {
    return !value1 || !value2 || loading;
  }, [value1, value2, loading]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const zecrey = (window as any).zecrey;
    if (zecrey) {
      try {
        setLoading(true);
        let val = await zecrey.request({
          method: "zecrey_L2_sendTransaction",
          params: {
            action: 6, // add liquidity
            from: props.accountName, // zecrey account name
            gasFeeAssetId: 0,
            args: {
              pairIndex: 0,
              asset1Amount: "0.1",
              asset2Amount: "0.0039",
            },
          },
        });
        console.log(val);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      window.open(
        "https://chrome.google.com/webstore/detail/zecrey/ojbpcbinjmochkhelkflddfnmcceomdi"
      );
    }
  };

  return (
    <form onSubmit={submit}>
      <h2 className={styles.title}>Add Liquidity</h2>
      <label>Amount of REY:</label>
      <input
        type="number"
        value={value1}
        onChange={(e) => {
          setValue1(e.target.value);
        }}
      />
      <label>Amount of ETH:</label>
      <input
        type="number"
        value={value2}
        onChange={(e) => {
          setValue2(e.target.value);
        }}
      />
      <br />
      <p>Asset pay for gas: REY</p>
      <input
        type="submit"
        disabled={disabled}
        value={loading ? "Add..." : "Add Liquidity"}
      />
    </form>
  );
};

const RemoveLiquidity = (props: {
  accountName: string;
  accountIndex: number;
}) => {
  const [value, setValue] = useState("0.1");
  const [loading, setLoading] = useState(false);
  const disabled = useMemo(() => {
    return !value || loading;
  }, [value, loading]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const zecrey = (window as any).zecrey;
    if (zecrey) {
      try {
        setLoading(true);
        let val = await zecrey.request({
          method: "zecrey_L2_sendTransaction",
          params: {
            action: 7, // remove liquidity
            from: props.accountName, // zecrey account name
            gasFeeAssetId: 0,
            args: {
              pairIndex: 0,
              removeAmount: "0.0001",
              slippage: 0.1, // percentage, 0.1 here means 0.1%
            },
          },
        });
        console.log(val);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      window.open(
        "https://chrome.google.com/webstore/detail/zecrey/ojbpcbinjmochkhelkflddfnmcceomdi"
      );
    }
  };

  return (
    <form onSubmit={submit}>
      <h2 className={styles.title}>Remove Liquidity</h2>
      <label>Remove Amount:</label>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <br />
      <p>Asset pay for gas: REY</p>
      <p>Slippage is 0.1%</p>
      <input
        type="submit"
        disabled={disabled}
        value={loading ? "Remove..." : "Remove Liquidity"}
      />
    </form>
  );
};

const Swap = (props: { accountName: string; accountIndex: number }) => {
  const [value, setValue] = useState("0.1");
  const [loading, setLoading] = useState(false);
  const disabled = useMemo(() => {
    return !value || loading;
  }, [value, loading]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const zecrey = (window as any).zecrey;
    if (zecrey) {
      try {
        setLoading(true);
        let val = await zecrey.request({
          method: "zecrey_L2_sendTransaction",
          params: {
            action: 5, // swap
            from: props.accountName, // zecrey account name
            gasFeeAssetId: 0,
            args: {
              pairIndex: 0,
              swapFromAssetId: 0,
              swapFromAmount: 0.01,
              swapToAssetId: 1,
              swapToAmount: 0.0003,
              min: 3, // without decimal places
            },
          },
        });
        console.log(val);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      window.open(
        "https://chrome.google.com/webstore/detail/zecrey/ojbpcbinjmochkhelkflddfnmcceomdi"
      );
    }
  };

  return (
    <form onSubmit={submit}>
      <h2 className={styles.title}>Swap</h2>
      <label>Remove Amount:</label>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <br />
      <p>Asset pay for gas: REY</p>
      <input
        type="submit"
        disabled={disabled}
        value={loading ? "Swap..." : "Swap Liquidity"}
      />
    </form>
  );
};
